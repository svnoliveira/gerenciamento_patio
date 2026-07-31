"use client";

import { useState, useEffect, useCallback } from "react";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { AreaTabs } from "@/app/components/OperatorQueueBoard/AreaTabs";
import { AreaStatusBadge } from "@/app/components/OperatorQueueBoard/AreaStatusBadge";
import { PublicQueueCard } from "./PublicQueueCard";
import { IArea } from "@/app/interface/area/area";
import { IQueueEntryPublic } from "@/app/interface/queue_entry/queue_entry";

const POLL_INTERVAL_MS = 5000;

interface IPublicBoardState {
  areas: IArea[];
  entries: IQueueEntryPublic[];
  loading: boolean;
}

export function PublicQueueBoard() {
  const [board, setBoard] = useState<IPublicBoardState>({
    areas: [],
    entries: [],
    loading: true,
  });
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  const fetchAreas = useCallback(async () => {
    const res = await clientApiFetch("/areas/?page_size=100");
    if (res.ok) {
      const data = await res.json();
      setBoard((prev) => ({ ...prev, areas: data.results }));
      if (data.results.length > 0 && selectedAreaId === null) {
        setSelectedAreaId(data.results[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once on mount
  }, []);

  const fetchEntries = useCallback(async (areaId: number) => {
    const res = await clientApiFetch(
      `/queue-entries/?area=${areaId}&status=ON_YARD&ordering=queue_order&page_size=100`,
    );
    const entries = res.ok ? (await res.json()).results : [];
    setBoard((prev) => ({ ...prev, entries, loading: false }));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchAreas is async; setBoard runs post-await
    fetchAreas();
  }, [fetchAreas]);

  useEffect(() => {
    if (selectedAreaId === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchEntries is async; setBoard runs post-await
    fetchEntries(selectedAreaId);
    const interval = setInterval(
      () => fetchEntries(selectedAreaId),
      POLL_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [selectedAreaId, fetchEntries]);

  const selectedArea = board.areas.find((a) => a.id === selectedAreaId) ?? null;

  if (board.loading) {
    return <p className="text-muted-foreground">Carregando fila...</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 items-center">
      <AreaTabs
        areas={board.areas}
        selectedAreaId={selectedAreaId}
        onSelectAction={setSelectedAreaId}
      />

      {selectedArea && <AreaStatusBadge areaId={selectedArea.id} />}

      {board.entries.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum caminhão nesta área no momento.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {board.entries.map((entry) => (
            <PublicQueueCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
