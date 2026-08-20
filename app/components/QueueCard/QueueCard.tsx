"use client";

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { STATUS_LABELS } from "@/app/interface/queue_entry/queue_entry";
import { STATUS_COLORS } from "@/lib/statusColors";
import { formatDate } from "@/lib/formatDate";

export function QueueCard({ entry }: { entry: IQueueEntry }) {
  return (
    <Card className="overflow-hidden py-0 gap-0 select-none">
      <div className={`h-1.5 w-full ${STATUS_COLORS[entry.status]}`} />
      <CardContent className="flex flex-col gap-2 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {entry.queue_order !== null && (
              <Badge variant="secondary" className="px-3 py-1.5 text-lg">
                #{entry.queue_order}
              </Badge>
            )}
            <span className="text-2xl font-bold tracking-tight">
              {entry.truck_plate}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`px-3 py-1 text-sm ${STATUS_COLORS[entry.status]}`}
        >
          {STATUS_LABELS[entry.status] ?? entry.status}
        </Badge>

        <div className="flex justify-between text-sm text-muted-foreground flex-col gap-1">
          <span>Area: {entry.area?.name ?? "Sem área"}</span>

          <span>{entry?.truck_driver}</span>
          <span>Empresa: {entry?.company_name}</span>
          <span>Carga: {entry?.truck_product}</span>
          <span>Criado em: {formatDate(entry.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
