"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, WifiOff } from "lucide-react";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { IAwaitingNFEntry } from "@/app/interface/queue_entry/queue_entry";
import { AwaitingNFCard } from "./AwaitingNFCard";

const POLL_INTERVAL_MS = 5000;
const FULL_RELOAD_MS = 6 * 60 * 60 * 1000;

interface IBoardState {
  entries: IAwaitingNFEntry[];
  loading: boolean;
  offline: boolean;
  nowMs: number;
}

export function AwaitingNFBoard() {
  const [board, setBoard] = useState<IBoardState>({
    entries: [],
    loading: true,
    offline: false,
    nowMs: 0,
  });

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

  if (board.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-[clamp(1.25rem,2vw,2.5rem)] text-muted-foreground">
        Carregando...
      </main>
    );
  }

  const clock = new Date(board.nowMs).toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <main className="min-h-screen bg-background p-[clamp(1rem,2vw,3rem)]">
      <header className="mb-[clamp(1rem,2vw,2.5rem)] flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(1.75rem,3vw,4rem)] font-bold tracking-tight">
          Aguardando NF ({board.entries.length})
        </h1>
        <div className="flex items-center gap-4 text-[clamp(1rem,1.5vw,2rem)] text-muted-foreground">
          {board.offline && (
            <span className="flex items-center gap-2 font-semibold text-destructive">
              <WifiOff className="size-[1.1em]" /> Sem conexão
            </span>
          )}
          <span>Atualizado às {clock}</span>
        </div>
      </header>

      {board.entries.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
          <CheckCircle2 className="size-[clamp(4rem,8vw,10rem)] text-primary" />
          <p className="text-[clamp(1.5rem,2.5vw,3.5rem)]">
            Nenhum caminhão aguardando NF
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-[clamp(0.75rem,1.5vw,2rem)]">
          {board.entries.map((entry) => (
            <AwaitingNFCard key={entry.id} entry={entry} nowMs={board.nowMs} />
          ))}
        </div>
      )}
    </main>
  );
}
