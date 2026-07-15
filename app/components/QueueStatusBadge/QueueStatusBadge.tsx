"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/app/components/ui/badge";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { useUserStore } from "@/app/stores/useUserStore";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  START_OF_DAY: {
    label: "Início do dia",
    className: "bg-muted text-muted-foreground",
  },
  BUSY: {
    label: "Movimentado",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  MODERATE: {
    label: "Médio",
    className: "bg-amber-100 text-amber-700 border-amber-300",
  },
  CALM: {
    label: "Tranquilo",
    className: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
};

const POLL_INTERVAL_MS = 30000;

export function QueueStatusBadge() {
  const [data, setData] = useState<{
    status: string;
    avg_minutes: number | null;
  } | null>(null);

  const user = useUserStore().user;
  const isOperator = user?.role === "ADMIN" || user?.role === "OPERATOR";

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      const res = await clientApiFetch("/queue-entries/stats/today/");
      if (res.ok && !cancelled) {
        setData(await res.json());
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!data) return null;

  const config = STATUS_CONFIG[data.status] ?? STATUS_CONFIG.START_OF_DAY;

  return (
    <Badge
      variant="outline"
      className={`px-4 py-2 text-base ${config.className}`}
    >
      {config.label}
      {data.avg_minutes !== null && isOperator && (
        <span className="ml-1.5 font-normal opacity-80">
          (~{Math.round(data.avg_minutes)} min)
        </span>
      )}
    </Badge>
  );
}
