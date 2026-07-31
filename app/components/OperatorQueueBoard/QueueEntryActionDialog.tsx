"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";

export function QueueEntryActionDialog({
  entry,
  open,
  onOpenChangeAction,
  onCancelAction,
  onConfirmScheduleAction,
  onStartOperationAction,
  onMovePositionAction,
  onFinishAction,
  onDetailsAction,
}: {
  entry: IQueueEntry | null;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onCancelAction: (entry: IQueueEntry) => void;
  onConfirmScheduleAction: (entry: IQueueEntry) => void;
  onStartOperationAction: (entry: IQueueEntry) => void;
  onMovePositionAction: (entry: IQueueEntry) => void;
  onFinishAction: (entry: IQueueEntry) => void;
  onDetailsAction: (entry: IQueueEntry) => void;
}) {
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry.truck_plate}</DialogTitle>
          <DialogDescription>
            O que deseja fazer com este agendamento?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {entry.status === "SCHEDULED" && (
            <Button
              className="h-14 text-lg"
              onClick={() => onConfirmScheduleAction(entry)}
            >
              Confirmar chegada
            </Button>
          )}

          {entry.status === "ON_YARD" && (
            <>
              <Button
                className="h-14 bg-emerald-600 text-lg text-white hover:bg-emerald-700"
                onClick={() => onStartOperationAction(entry)}
              >
                Iniciar operação
              </Button>
              <Button
                className="h-14 text-lg"
                variant="outline"
                onClick={() => onMovePositionAction(entry)}
              >
                Mover para posição...
              </Button>
            </>
          )}

          {entry.status === "AWAITING_CONCLUSION" && (
            <Button
              className="h-14 bg-emerald-600 text-lg text-white hover:bg-emerald-700"
              onClick={() => onFinishAction(entry)}
            >
              Finalizar (NF entregue)
            </Button>
          )}

          <Button
            className="h-14 text-lg"
            variant="secondary"
            onClick={() => onDetailsAction(entry)}
          >
            Ver detalhes
          </Button>

          <Button
            className="h-14 text-lg"
            variant="destructive"
            onClick={() => onCancelAction(entry)}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
