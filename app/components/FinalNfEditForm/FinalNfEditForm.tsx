"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { setFinalNf } from "@/app/actions/api/server/queue-entries-final-nf";
import {
  DOCUMENT_FILE_ACCEPT,
  validateDocumentFile,
} from "@/lib/documentFileRules";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";

function fileNameFromUrl(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop() ?? "");
  } catch {
    return "Arquivo atual";
  }
}

export function FinalNfEditForm({ entry }: { entry: IQueueEntry }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [removing, setRemoving] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const lock = useRef(false);

  const hasChange = file !== null || removing;

  async function handleSave() {
    if (lock.current || !hasChange) return;
    lock.current = true;
    setIsPending(true);
    try {
      await setFinalNf(entry.id, removing ? null : file);
      toast(removing ? "Arquivo da NF removido" : "Arquivo da NF salvo");
      router.push("/dashboard/queue-entries");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Erro ao salvar o arquivo da NF",
      );
    } finally {
      lock.current = false;
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          NF final — {entry.truck_plate}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Este registro está finalizado. Apenas o arquivo da NF pode ser
          alterado.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="final-nf-edit">
          Arquivo da NF (PDF, DOC, DOCX ou TXT)
        </Label>

        {entry.final_nf && !removing && !file && (
          <div className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
            <a
              href={entry.final_nf}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate underline"
            >
              {fileNameFromUrl(entry.final_nf)}
            </a>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => setRemoving(true)}
              disabled={isPending}
            >
              Remover
            </Button>
          </div>
        )}
        {removing && (
          <p className="text-sm text-muted-foreground">
            O arquivo será removido ao salvar.
          </p>
        )}

        <Input
          id="final-nf-edit"
          type="file"
          accept={DOCUMENT_FILE_ACCEPT}
          disabled={isPending}
          onChange={(e) => {
            const picked = e.target.files?.[0];
            if (!picked) return setFile(null);
            const problem = validateDocumentFile(picked);
            if (problem) {
              toast(problem);
              e.target.value = "";
              return;
            }
            setFile(picked);
            setRemoving(false);
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          className="h-12 flex-[2]"
          onClick={handleSave}
          disabled={!hasChange || isPending}
        >
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
