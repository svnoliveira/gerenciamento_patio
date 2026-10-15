import { Clock, TriangleAlert } from "lucide-react";
import { IAwaitingNFEntry } from "@/app/interface/queue_entry/queue_entry";
import { formatDate } from "@/lib/formatDate";
import { formatDuration } from "@/lib/formatDuration";
import { cn } from "@/lib/utils";

const OVERDUE_THRESHOLD_MS = 15 * 60 * 1000;

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
  const Icon = isOverdue ? TriangleAlert : Clock;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-[clamp(0.5rem,1vw,1.25rem)] rounded-2xl border-2 bg-card p-[clamp(1rem,1.8vw,2.5rem)] shadow-sm",
        isOverdue ? "border-destructive bg-destructive/10" : "border-border",
      )}
    >
      {isOverdue && (
        <div className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl border-[6px] border-destructive" />
      )}

      <span className="text-[clamp(2rem,3.4vw,4.5rem)] leading-none font-bold tracking-tight">
        {entry.truck_plate}
      </span>
      <span className="text-[clamp(1.25rem,2vw,2.5rem)] font-medium">
        {entry.truck_driver}
      </span>

      <div className="mt-auto flex flex-col gap-1 text-[clamp(1rem,1.5vw,2rem)] text-muted-foreground">
        <span>
          Aguardando desde {formatDate(entry.awaiting_conclusion_time)}
        </span>
        {startMs !== null && (
          <span
            className={cn(
              "flex items-center gap-2 font-semibold",
              isOverdue && "text-destructive",
            )}
          >
            <Icon className="size-[1.1em]" />
            há{" "}
            {formatDuration(
              entry.awaiting_conclusion_time,
              new Date(nowMs).toISOString(),
            )}
          </span>
        )}
      </div>
    </div>
  );
}
