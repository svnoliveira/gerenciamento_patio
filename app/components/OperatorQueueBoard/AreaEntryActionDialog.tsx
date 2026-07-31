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

export function AreaEntryActionDialog({
  entry,
  open,
  onOpenChangeAction,
  onCancelAction,
  onEndOperationAction,
  onDetailsAction,
}: {
  entry: IQueueEntry | null;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onCancelAction: (entry: IQueueEntry) => void;
  onEndOperationAction: (entry: IQueueEntry) => void;
  onDetailsAction: (entry: IQueueEntry) => void;
}) {
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry.truck_plate}</DialogTitle>
          <DialogDescription>
            O que deseja fazer com este caminhão?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Button
            className="h-14 bg-emerald-600 text-lg text-white hover:bg-emerald-700"
            onClick={() => onEndOperationAction(entry)}
          >
            Encerrar operação
          </Button>
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
