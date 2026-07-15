"use client";

import { useState, useEffect } from "react";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { QueueCard } from "@/app/components/QueueCard/QueueCard";
import { IQueueEntryPublic } from "@/app/interface/queue_entry/queue_entry";
import { QueueStatusBadge } from "@/app/components/QueueStatusBadge/QueueStatusBadge";

const ACTIVE_STATUSES = "WAITING,STANDBY,INSIDE";
const POLL_INTERVAL_MS = 5000;

export default function LiveQueuePage() {
  const [entries, setEntries] = useState<IQueueEntryPublic[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchQueue() {
      try {
        const res = await clientApiFetch(
          `/queue-entries/?status_in=${ACTIVE_STATUSES}&ordering=queue_order&page_size=100`,
        );
        if (!res.ok) throw new Error("Falha ao carregar fila");
        const data = await res.json();
        if (!cancelled) {
          setEntries(data.results);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Erro ao carregar fila",
          );
        }
      }
    }

    fetchQueue();
    const interval = setInterval(fetchQueue, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-md flex-col gap-4 px-4 py-6">
      <div className="flex items-center flex-col gap 1 justify-between mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Fila ao vivo</h1>
        <QueueStatusBadge />
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {entries === null && !error && (
        <p className="text-muted-foreground">Carregando...</p>
      )}

      {entries !== null && entries.length === 0 && (
        <p className="text-muted-foreground">
          Nenhum caminhão na fila no momento.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {entries?.map((entry) => (
          <QueueCard key={entry.id} entry={entry} />
        ))}
      </div>
    </main>
  );
}
