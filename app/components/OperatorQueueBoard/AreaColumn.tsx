"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { SetPositionDialog } from "./SetPositionDialog";
import { IArea } from "@/app/interface/area/area";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { CancelConfirmDialog } from "./CancelConfirmDialog";

export function AreaColumn({
  area,
  entries,
  waitingCount,
  onAction,
  onMoveToWaiting,
}: {
  area: IArea;
  entries: IQueueEntry[];
  waitingCount: number;
  onAction: (id: number, action: "finish" | "cancel" | "standby") => void;
  onMoveToWaiting: (id: number, position: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `area-${area.id}` });
  const isFull = entries.length >= area.capacity;
  const [dialogEntryId, setDialogEntryId] = useState<number | null>(null);
  const [cancelTarget, setCancelTarget] = useState<IQueueEntry | null>(null);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "space-y-3 rounded-lg border-2 border-dashed p-3 transition-colors",
        isOver && "border-primary bg-primary/5",
        isFull && "border-destructive/40",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{area.name}</h3>
        <Badge variant={isFull ? "destructive" : "secondary"}>
          {entries.length}/{area.capacity}
        </Badge>
      </div>

      {entries.map((entry) => (
        <Card key={entry.id} className="py-0 gap-0">
          <CardContent className="flex flex-col gap-3 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Chegada: {formatDate(entry.created_at)}
              </span>
              {entry.status === "STANDBY" && (
                <Badge variant="outline" className="text-xs">
                  Parado
                </Badge>
              )}
              <span className="text-sm font-bold">{entry.truck_plate}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <Button
                size="sm"
                onClick={() => setCancelTarget(entry)}
                variant="destructive"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => setDialogEntryId(entry.id)}
                className="bg-amber-500 text-white hover:bg-amber-600"
              >
                Voltar
              </Button>
              <div></div>
              {/* <Button
                size="sm"
                onClick={() => onAction(entry.id, "standby")}
                variant="outline"
              >
                Parar
              </Button> */}
              <Button
                size="sm"
                onClick={() => onAction(entry.id, "finish")}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Finalizar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <SetPositionDialog
        open={dialogEntryId !== null}
        onOpenChange={(open) => !open && setDialogEntryId(null)}
        maxPosition={waitingCount + 1}
        onConfirm={(position) => {
          if (dialogEntryId !== null) onMoveToWaiting(dialogEntryId, position);
        }}
      />

      <CancelConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        plate={cancelTarget?.truck_plate ?? ""}
        onConfirm={() => {
          if (cancelTarget) onAction(cancelTarget.id, "cancel");
          setCancelTarget(null);
        }}
      />
    </div>
  );
}
