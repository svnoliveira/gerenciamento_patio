"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { formatDate } from "@/lib/formatDate";

export function ScheduledEntryPickCard({
  entry,
  onSelectAction,
}: {
  entry: IQueueEntry;
  onSelectAction: () => void;
}) {
  return (
    <Card
      className="cursor-pointer py-0 gap-0 active:bg-muted"
      onClick={onSelectAction}
    >
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">{entry.truck_plate}</span>
          <Badge variant="secondary" className="text-xs">
            Agendado em {formatDate(entry.created_at)}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>
            Empresa:{" "}
            <span className="font-medium text-foreground">
              {entry.company_name ?? "—"}
            </span>
          </span>
          <span>
            Motorista:{" "}
            <span className="font-medium text-foreground">
              {entry.truck_driver}
            </span>
          </span>
          <span>
            Produto:{" "}
            <span className="font-medium text-foreground">
              {entry.truck_product}
            </span>
          </span>
          <span>
            Área:{" "}
            <span className="font-medium text-foreground">
              {entry.area?.name ?? "Não definida"}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
