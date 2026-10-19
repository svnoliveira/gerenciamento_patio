"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CheckCircle2, WifiOff } from "lucide-react";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { IAwaitingNFEntry } from "@/app/interface/queue_entry/queue_entry";

import { cn } from "@/lib/utils";
import { AwaitingNFCard } from "./AwaitingNFCard";
import { useIsPhoneWidth } from "@/app/hooks/useIsPhoneWidth";

const POLL_INTERVAL_MS = 5000;
const FULL_RELOAD_MS = 6 * 60 * 60 * 1000;

const GAP_PX = 16;
const CARD_DESIGN = { w: 20, h: 24 };
const MAX_CELL_PX = { w: 560, h: 672 };

interface IBoardState {
  entries: IAwaitingNFEntry[];
  loading: boolean;
  offline: boolean;
  nowMs: number;
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

function computeLayout(count: number, width: number, height: number) {
  let best = { cols: 1, rows: Math.max(count, 1), scale: 0 };
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const cellW = (width - GAP_PX * (cols - 1)) / cols;
    const cellH = (height - GAP_PX * (rows - 1)) / rows;
    const scale = Math.min(cellW / CARD_DESIGN.w, cellH / CARD_DESIGN.h);
    if (scale > best.scale) best = { cols, rows, scale };
  }
  return best;
}

export function AwaitingNFBoard() {
  const [board, setBoard] = useState<IBoardState>({
    entries: [],
    loading: true,
    offline: false,
    nowMs: 0,
  });
  const isPhone = useIsPhoneWidth();
  const [areaRef, areaSize] = useElementSize<HTMLDivElement>();
  const fit = !isPhone;

  const layout = useMemo(
    () => computeLayout(board.entries.length, areaSize.width, areaSize.height),
    [board.entries.length, areaSize.width, areaSize.height],
  );

  const fetchEntries = useCallback(async () => {
    try {
      const res = await clientApiFetch("/queue-entries/awaiting-nf/");
      if (!res.ok) throw new Error("bad response");
      const entries: IAwaitingNFEntry[] = await res.json();
      setBoard({ entries, loading: false, offline: false, nowMs: Date.now() });
    } catch {
      setBoard((prev) => ({
        ...prev,
        loading: false,
        offline: true,
        nowMs: Date.now(),
      }));
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchEntries();
    };
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  useEffect(() => {
    const timeout = setTimeout(() => window.location.reload(), FULL_RELOAD_MS);
    return () => clearTimeout(timeout);
  }, []);

  const clock = board.nowMs
    ? new Date(board.nowMs).toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <main
      className={cn(
        "flex flex-col bg-background p-[clamp(1rem,2vw,3rem)]",
        fit ? "h-dvh overflow-hidden" : "min-h-dvh",
      )}
    >
      <header className="mb-[clamp(0.75rem,1.5vw,2rem)] flex shrink-0 flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(1.75rem,3vw,4rem)] font-bold tracking-tight">
          Aguardando NF ({board.entries.length})
        </h1>
        <div className="flex items-center gap-4 text-[clamp(1rem,1.5vw,2rem)] text-muted-foreground">
          {board.offline && (
            <span className="flex items-center gap-2 font-semibold text-destructive">
              <WifiOff className="size-[1.1em]" /> Sem conexão
            </span>
          )}
          {clock && <span>Atualizado às {clock}</span>}
        </div>
      </header>

      <div ref={areaRef} className="relative min-h-0 flex-1">
        {board.loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-[clamp(1.25rem,2vw,2.5rem)] text-muted-foreground">
            Carregando...
          </div>
        ) : board.entries.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
            <CheckCircle2 className="size-[clamp(4rem,8vw,10rem)] text-primary" />
            <p className="text-[clamp(1.5rem,2.5vw,3.5rem)]">
              Nenhum caminhão aguardando NF
            </p>
          </div>
        ) : fit ? (
          <div
            className="absolute inset-0 grid content-center justify-center"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, ${MAX_CELL_PX.w}px))`,
              gridTemplateRows: `repeat(${layout.rows}, minmax(0, ${MAX_CELL_PX.h}px))`,
              gap: GAP_PX,
            }}
          >
            {board.entries.map((entry) => (
              <AwaitingNFCard
                key={entry.id}
                entry={entry}
                nowMs={board.nowMs}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {board.entries.map((entry) => (
              <div key={entry.id} className="aspect-5/6">
                <AwaitingNFCard entry={entry} nowMs={board.nowMs} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
