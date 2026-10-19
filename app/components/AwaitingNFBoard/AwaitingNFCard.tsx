import { Building2, Clock, MapPin, TriangleAlert, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { IAwaitingNFEntry } from "@/app/interface/queue_entry/queue_entry";
import { formatDate } from "@/lib/formatDate";
import { formatDuration } from "@/lib/formatDuration";
import { cn } from "@/lib/utils";

const OVERDUE_THRESHOLD_MS = 15 * 60 * 1000;

const u = (k: number) => `calc(var(--u) * ${k})`;

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex min-w-0 items-start" style={{ gap: u(0.8) }}>
      <Icon
        className="shrink-0 text-muted-foreground"
        style={{ width: u(1.5), height: u(1.5), marginTop: u(0.15) }}
      />
      <div className="min-w-0 flex-1">
        <p
          className="tracking-wide text-muted-foreground uppercase"
          style={{ fontSize: u(0.75), lineHeight: 1.2 }}
        >
          {label}
        </p>
        <p
          className="truncate font-semibold"
          style={{ fontSize: u(1.4), lineHeight: 1.2 }}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export function AwaitingNFCard({
  entry,
  nowMs,
}: {
  entry: IAwaitingNFEntry;
  nowMs: number;
}) {
  const startMs = entry.awaiting_conclusion_time
    ? new Date(entry.awaiting_conclusion_time).getTime()
    : null;
  const isOverdue = startMs !== null && nowMs - startMs > OVERDUE_THRESHOLD_MS;
  const WaitIcon = isOverdue ? TriangleAlert : Clock;

  return (
    <div className="h-full w-full @container-size">
      <div
        className={cn(
          "relative flex h-full w-full flex-col overflow-hidden border bg-card shadow-sm",
          isOverdue ? "border-destructive bg-destructive/10" : "border-border",
        )}
        style={
          {
            "--u": "min(5cqw, 4.1667cqh)",
            padding: u(1.3),
            gap: u(0.8),
            borderRadius: u(1.2),
            borderWidth: u(0.15),
          } as React.CSSProperties
        }
      >
        {isOverdue && (
          <div
            className="pointer-events-none absolute inset-0 animate-pulse border-destructive"
            style={{ borderWidth: u(0.4), borderRadius: u(1.2) }}
          />
        )}

        <span
          className="font-bold tracking-tight whitespace-nowrap"
          style={{ fontSize: u(3.6), lineHeight: 1 }}
        >
          {entry.truck_plate}
        </span>

        <div
          className="flex flex-col border-t"
          style={{ gap: u(0.8), paddingTop: u(1) }}
        >
          <InfoRow icon={User} label="Motorista" value={entry.truck_driver} />
          <InfoRow
            icon={Building2}
            label="Empresa"
            value={entry.company_name}
          />
          <InfoRow icon={MapPin} label="Área" value={entry.area_name} />
        </div>

        <div
          className={cn(
            "mt-auto flex flex-col border-t",
            isOverdue ? "text-destructive" : "text-muted-foreground",
          )}
          style={{ paddingTop: u(0.9), gap: u(0.2), fontSize: u(1.1) }}
        >
          <span className="truncate">
            Desde {formatDate(entry.awaiting_conclusion_time)}
          </span>
          {startMs !== null && (
            <span
              className="flex items-center font-semibold"
              style={{ gap: u(0.5) }}
            >
              <WaitIcon style={{ width: u(1.2), height: u(1.2) }} />
              há{" "}
              {formatDuration(
                entry.awaiting_conclusion_time,
                new Date(nowMs).toISOString(),
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
