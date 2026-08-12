"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PhotoInput } from "../PhotoInput/PhotoInput";
import { AreaSelect } from "../AreaSelect/AreaSelect";
import { EstimateDialog } from "../QueueEntryForm/EstimateDialog";
import { compressImage } from "@/app/actions/api/client/compressImage";
import { completeScheduledEntry } from "@/app/actions/api/server/queue-entries-confirm";
import {
  buildQueueEntryCompleteSchema,
  QueueEntryCompleteFormValues,
} from "./schema";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";

const JOB_OPTIONS = [
  { value: "Carga", label: "Carga" },
  { value: "Descarga", label: "Descarga" },
];

export function QueueEntryConfirmCompleteForm({
  entry,
  onBackAction,
}: {
  entry: IQueueEntry;
  onBackAction: () => void;
}) {
  const router = useRouter();
  const needsArea = !entry.area;
  const hasSavedDocumentPhoto = Boolean(entry.document_photo);
  const schema = useMemo(
    () => buildQueueEntryCompleteSchema(needsArea, hasSavedDocumentPhoto),
    [needsArea, hasSavedDocumentPhoto],
  );

  const [isPending, setIsPending] = useState(false);
  const [estimateDialog, setEstimateDialog] = useState<{
    open: boolean;
    message: string | null;
    entryId: number | null;
  }>({ open: false, message: null, entryId: null });

  const form = useForm<QueueEntryCompleteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      job: "" as never,
      area: entry.area?.id,
      photo: undefined,
      document_photo: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      job: "" as never,
      area: entry.area?.id,
      photo: undefined,
      document_photo: undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resync defaults only when a different entry is picked
  }, [entry.id]);

  const jobValue = useWatch({ control: form.control, name: "job" });
  const areaValue = useWatch({ control: form.control, name: "area" });
  const documentPhotoValue = useWatch({
    control: form.control,
    name: "document_photo",
  });

  async function onSubmit(values: QueueEntryCompleteFormValues) {
    setIsPending(true);
    try {
      const compressedPhoto = await compressImage(
        values.photo,
        entry.truck_plate,
      );

      const compressedDocumentPhoto = values.document_photo
        ? await compressImage(
            values.document_photo,
            `${entry.truck_plate}-document`,
          )
        : undefined;
      const result = await completeScheduledEntry(
        entry.id,
        {
          ...values,
          photo: compressedPhoto,
          document_photo: compressedDocumentPhoto,
        },
        needsArea,
      );

      toast("Caminhão confirmado no pátio!");
      setEstimateDialog({
        open: true,
        message: result.estimate?.message ?? null,
        entryId: result.id,
      });
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Erro ao confirmar agendamento",
      );
    } finally {
      setIsPending(false);
    }
  }

  function handleDialogContinue() {
    if (estimateDialog.entryId) {
      router.push(`/queue-entries/${estimateDialog.entryId}`);
    }
    setEstimateDialog({ open: false, message: null, entryId: null });
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-md flex-col gap-5"
      >
        <h1 className="text-2xl font-bold tracking-tight">Confirmar chegada</h1>

        <div className="space-y-2 rounded-xl border bg-muted/30 p-4 text-sm">
          <ReadOnlyRow label="Placa" value={entry.truck_plate} />
          <ReadOnlyRow label="Empresa" value={entry.company_name ?? "—"} />
          <ReadOnlyRow label="Motorista" value={entry.truck_driver} />
          <ReadOnlyRow label="CPF" value={entry.truck_cpf} />
          <ReadOnlyRow label="Telefone" value={entry.truck_cellphone} />
          <ReadOnlyRow label="Produto" value={entry.truck_product} />
          <ReadOnlyRow label="Tipo de veículo" value={entry.truck_type} />
          <ReadOnlyRow label="Tipo de carga" value={entry.truck_cargo_type} />
          {entry.area && <ReadOnlyRow label="Área" value={entry.area.name} />}
        </div>

        <div className="space-y-1.5">
          <Label className="text-base">Operação</Label>
          <Select
            value={jobValue}
            onValueChange={(v) =>
              form.setValue("job", v as "Carga" | "Descarga", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="h-14 w-full text-lg">
              <SelectValue placeholder="Selecione">
                {JOB_OPTIONS.find((o) => o.value === jobValue)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {JOB_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.job && (
            <p className="text-sm text-destructive">
              {form.formState.errors.job.message}
            </p>
          )}
        </div>

        {needsArea && (
          <div className="space-y-1.5">
            <Label className="text-base">Área</Label>
            <AreaSelect
              value={areaValue}
              onChangeAction={(id) =>
                form.setValue("area", id, { shouldValidate: true })
              }
            />
            {form.formState.errors.area && (
              <p className="text-sm text-destructive">
                {form.formState.errors.area.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-base">Foto do caminhão</Label>
          <Controller
            name="photo"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <PhotoInput value={value} onChangeAction={onChange} />
            )}
          />
          {form.formState.errors.photo && (
            <p className="text-sm text-destructive">
              {form.formState.errors.photo.message}
            </p>
          )}
        </div>

        {entry.document_photo && !documentPhotoValue ? (
          <div className="space-y-2 rounded-xl border p-3">
            <Label className="text-base">Foto do documento salva</Label>
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border bg-black/5">
              <Image
                src={entry.document_photo}
                alt="Foto do documento salva"
                fill
                className="object-cover"
                sizes="(max-width: 500px) 100vw, 500px"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Esta foto já foi salva no agendamento. Faça upload apenas se
              quiser substituí-la.
            </p>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label className="text-base">Foto do documento</Label>
          <Controller
            name="document_photo"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <PhotoInput value={value} onChangeAction={onChange} />
            )}
          />
          {form.formState.errors.document_photo && (
            <p className="text-sm text-destructive">
              {form.formState.errors.document_photo.message}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBackAction}
            className="h-16 flex-1 text-lg"
          >
            Voltar
          </Button>
          <Button
            type="submit"
            size="lg"
            className="h-16 flex-2 text-xl font-semibold"
            disabled={isPending}
          >
            {isPending ? "Enviando..." : "Confirmar chegada"}
          </Button>
        </div>
      </form>

      <EstimateDialog
        open={estimateDialog.open}
        message={estimateDialog.message}
        onContinueAction={handleDialogContinue}
      />
    </>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
