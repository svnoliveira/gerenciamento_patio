"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  DOCUMENT_FILE_ACCEPT,
  validateDocumentFile,
} from "@/lib/documentFileRules";

export function FinalizeDialog({
  plate,
  description,
  open,
  onOpenChangeAction,
  onConfirmAction,
}: {
  plate: string;
  description?: string;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onConfirmAction: (file: File | null) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const lock = useRef(false); // synchronous guard against double taps

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) {
      setFile(null);
      setError(null);
      return;
    }
    const problem = validateDocumentFile(picked);
    if (problem) {
      setFile(null);
      setError(problem);
      e.target.value = "";
      return;
    }
    setError(null);
    setFile(picked);
  }

  async function handleConfirm() {
    if (lock.current) return;
    lock.current = true;
    setIsPending(true);
    try {
      await onConfirmAction(file);
    } finally {
      lock.current = false;
      setIsPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChangeAction(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar {plate}</DialogTitle>
          <DialogDescription>
            {description ??
              "Você pode anexar o arquivo da NF agora (opcional). A finalização não depende dele."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="final-nf">
            Arquivo da NF (PDF, DOC, DOCX ou TXT)
          </Label>
          <Input
            id="final-nf"
            type="file"
            accept={DOCUMENT_FILE_ACCEPT}
            onChange={handleFileChange}
            disabled={isPending}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChangeAction(false)}
            disabled={isPending}
          >
            Voltar
          </Button>
          <Button
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending
              ? "Finalizando..."
              : file
                ? "Finalizar e anexar NF"
                : "Finalizar sem arquivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
