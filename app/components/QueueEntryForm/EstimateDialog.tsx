"use client";

import { Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/app/components/ui/alert-dialog";

export function EstimateDialog({
  open,
  message,
  onContinueAction,
}: {
  open: boolean;
  message: string | null;
  onContinueAction: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Clock size={28} className="text-primary" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Agendamento confirmado!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg">
            {message ?? "Seu caminhão foi adicionado à fila."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onContinueAction}
            className="h-14 w-full text-lg"
          >
            Entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
