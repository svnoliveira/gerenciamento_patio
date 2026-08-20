"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { AreaSelect } from "@/app/components/AreaSelect/AreaSelect";

export function ChangeAreaDialog({
  open,
  onOpenChangeAction,
  currentAreaId,
  onConfirmAction,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  currentAreaId: number | undefined;
  onConfirmAction: (areaId: number) => void;
}) {
  const [areaId, setAreaId] = useState<number | undefined>(currentAreaId);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trocar área</DialogTitle>
        </DialogHeader>

        <AreaSelect value={areaId} onChangeAction={setAreaId} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!areaId || areaId === currentAreaId}
            onClick={() => {
              if (areaId) onConfirmAction(areaId);
              onOpenChangeAction(false);
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
