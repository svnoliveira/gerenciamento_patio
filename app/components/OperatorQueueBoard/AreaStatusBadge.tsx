"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/app/components/ui/badge";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";

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

export function AreaStatusBadge({ areaId }: { areaId: number }) {
  const [data, setData] = useState<{
    status: string;
    avg_minutes: number | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      const res = await clientApiFetch(
        `/queue-entries/stats/today/?area=${areaId}`,
      );
      if (res.ok && !cancelled) setData(await res.json());
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [areaId]);

  if (!data) return null;

  const config = STATUS_CONFIG[data.status] ?? STATUS_CONFIG.START_OF_DAY;

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1.5 text-sm ${config.className}`}
    >
      {config.label}
      {data.avg_minutes !== null && (
        <span className="ml-1.5 font-normal opacity-80">
          (~{Math.round(data.avg_minutes)} min)
        </span>
      )}
    </Badge>
  );
}
