"use client";

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { IArea } from "@/app/interface/area/area";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

export function AreaOperationPanel({
  area,
  entries,
  onSelectAction,
}: {
  area: IArea;
  entries: IQueueEntry[];
  onSelectAction: (entry: IQueueEntry) => void;
}) {
  const isFull = entries.length >= area.capacity;

  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border-2 border-dashed p-3",
        isFull && "border-destructive/40",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{area.name}</h3>
        <Badge variant={isFull ? "destructive" : "secondary"}>
          {entries.length}/{area.capacity}
        </Badge>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum caminhão em operação.
        </p>
      ) : (
        entries.map((entry) => (
          <Card
            key={entry.id}
            className="cursor-pointer py-0 gap-0"
            onClick={() => onSelectAction(entry)}
          >
            <CardContent className="flex items-center justify-between p-3">
              <span className="text-sm font-bold">{entry.truck_plate}</span>
              <span className="text-xs text-muted-foreground">
                Início: {formatDate(entry.start_time)}
              </span>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
