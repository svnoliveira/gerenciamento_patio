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
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export function SetPositionDialog({
  open,
  onOpenChangeAction,
  maxPosition,
  onConfirmAction,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  maxPosition: number;
  onConfirmAction: (position: number) => void | Promise<void>;
}) {
  const [position, setPosition] = useState(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escolha a posição na fila</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="position">Posição (1 a {maxPosition || 1})</Label>
          <Input
            id="position"
            type="number"
            min={1}
            max={Math.max(maxPosition, 1)}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onConfirmAction(position);
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
