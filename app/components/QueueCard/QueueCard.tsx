"use client";

import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  IQueueEntry,
  IQueueEntryPublic,
  STATUS_LABELS,
} from "@/app/interface/queue_entry/queue_entry";
import { STATUS_COLORS } from "@/lib/statusColors";
import { formatDate } from "@/lib/formatDate";

export function QueueCard({
  entry,
}: {
  entry: IQueueEntryPublic | IQueueEntry;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.includes("dashboard");

  return (
    <Card
      className="cursor-pointer overflow-hidden py-0 gap-0 select-none"
      onDoubleClick={() => router.push(`/queue-entries/${entry.id}`)}
    >
      <div className={`h-1.5 w-full ${STATUS_COLORS[entry.status]}`} />
      <CardContent className="flex flex-col gap-2 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {entry.queue_order !== null && (
              <Badge variant="secondary" className="px-3 py-1.5 text-lg">
                #{entry.queue_order}
              </Badge>
            )}
            <span
              className={`text-${isDashboard ? "[16px]" : "2xl"} font-bold tracking-tight`}
            >
              {entry.truck_plate}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="outline"
              className={`px-3 py-1 text-sm ${STATUS_COLORS[entry.status]}`}
            >
              {STATUS_LABELS[entry.status] ?? entry.status}
            </Badge>
            {entry.area?.name && (
              <span className="text-sm text-muted-foreground">
                {entry.area.name}
              </span>
            )}
          </div>
        </div>

        {"created_at" in entry && (
          <span className="text-sm text-muted-foreground mx-auto">
            Chegada: {formatDate(entry?.created_at)}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
