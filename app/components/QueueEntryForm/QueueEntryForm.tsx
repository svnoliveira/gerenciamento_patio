"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { formatCPF, formatCellphone, formatPlate } from "@/lib/formatNumbers";
import { checkDuplicatePlate } from "@/lib/checkDuplicatePlate";
import { createQueueEntry } from "@/app/actions/api/server/queue-entries-create";
import {
  queueEntrySchema,
  QueueEntryFormInput,
  QueueEntryFormOutput,
} from "./schema";
import { ITrucksWithJobPhoto } from "@/app/interface/truck/truck";
import { PhotoInput } from "../PhotoInput/PhotoInput";
import { EstimateDialog } from "./EstimateDialog";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { compressImage } from "@/app/actions/api/client/compressImage";

// TODO: replace
const TYPE_OPTIONS = [
  { value: "Granel", label: "Granel" },
  { value: "Bag", label: "Bag" },
  { value: "Pallet", label: "Pallet" },
];

const JOB_OPTIONS = [
  { value: "Carga", label: "Carga" },
  { value: "Descarga", label: "Descarga" },
];

export function QueueEntryForm({
  data,
  onSuccessAction,
}: {
  data?: ITrucksWithJobPhoto;
  onSuccessAction?: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [estimateDialog, setEstimateDialog] = useState<{
    open: boolean;
    message: string | null;
    entryId: number | null;
  }>({ open: false, message: null, entryId: null });
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<QueueEntryFormOutput | null>(null);

  const form = useForm<QueueEntryFormInput, unknown, QueueEntryFormOutput>({
    resolver: zodResolver(queueEntrySchema),
    defaultValues: {
      company_name: data?.company?.name ?? "",
      truck_plate: data?.plate ?? "",
      truck_driver: data?.driver ?? "",
      truck_cpf: data?.cpf ?? "",
      truck_cellphone: data?.cellphone ?? "",
      truck_product: data?.product ?? "",
      truck_type: data?.type ?? "",
      job: data?.job ?? ("" as never),
      photo: data?.photo ?? undefined,
    },
  });

  const truckTypeValue = useWatch({
    control: form.control,
    name: "truck_type",
  });

  const jobValue = useWatch({
    control: form.control,
    name: "job",
  });

  async function submitEntry(values: QueueEntryFormOutput) {
    startTransition(async () => {
      try {
        const compressedPhoto = await compressImage(
          values.photo,
          values.truck_plate,
        );
        const entry = await createQueueEntry(values, compressedPhoto);
        toast("Agendamento registrado com sucesso!");
        form.reset();
        onSuccessAction?.();

        const estimateRes = await clientApiFetch(
          `/queue-entries/${entry.id}/estimate/`,
        );
        const estimateData = estimateRes.ok ? await estimateRes.json() : null;

        setEstimateDialog({
          open: true,
          message: estimateData?.message ?? null,
          entryId: entry.id,
        });
      } catch (error) {
        toast(
          error instanceof Error
            ? error.message
            : "Erro ao registrar agendamento",
        );
      }
    });
  }

  function handleDialogContinue() {
    if (estimateDialog.entryId) {
      router.push(`/queue-entries/${estimateDialog.entryId}`);
    }
    setEstimateDialog({ open: false, message: null, entryId: null });
  }

  async function onSubmit(values: QueueEntryFormOutput) {
    const isDuplicate = await checkDuplicatePlate(values.truck_plate);
    if (isDuplicate) {
      setPendingValues(values);
      setDuplicateOpen(true);
      return;
    }
    submitEntry(values);
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-md flex-col gap-5"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Realizar agendamento
        </h1>

        <Field
          label="Empresa"
          error={form.formState.errors.company_name?.message}
        >
          <Input className="h-14 text-lg" {...form.register("company_name")} />
        </Field>

        <Field label="Placa" error={form.formState.errors.truck_plate?.message}>
          <Controller
            name="truck_plate"
            control={form.control}
            render={({ field }) => (
              <Input
                className="h-14 text-lg"
                placeholder="ABC1D23"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(formatPlate(e.target.value))}
                maxLength={7}
              />
            )}
          />
        </Field>

        <Field
          label="Motorista"
          error={form.formState.errors.truck_driver?.message}
        >
          <Input className="h-14 text-lg" {...form.register("truck_driver")} />
        </Field>

        <Field label="CPF" error={form.formState.errors.truck_cpf?.message}>
          <Controller
            name="truck_cpf"
            control={form.control}
            render={({ field }) => (
              <Input
                className="h-14 text-lg"
                placeholder="000.000.000-00"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(formatCPF(e.target.value))}
              />
            )}
          />
        </Field>

        <Field
          label="Telefone"
          error={form.formState.errors.truck_cellphone?.message}
        >
          <Controller
            name="truck_cellphone"
            control={form.control}
            render={({ field }) => (
              <Input
                className="h-14 text-lg"
                placeholder="(00) 0 0000-0000"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(formatCellphone(e.target.value))
                }
              />
            )}
          />
        </Field>

        <Field
          label="Produto"
          error={form.formState.errors.truck_product?.message}
        >
          <Input className="h-14 text-lg" {...form.register("truck_product")} />
        </Field>

        <Field
          label="Tipo de veículo"
          error={form.formState.errors.truck_type?.message}
        >
          <Select
            value={truckTypeValue}
            onValueChange={(v) =>
              form.setValue("truck_type", v || "", { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-14 w-full text-lg">
              <SelectValue placeholder="Selecione">
                {TYPE_OPTIONS.find((o) => o.value === truckTypeValue)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Operação" error={form.formState.errors.job?.message}>
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
        </Field>

        <Field
          label="Foto do caminhão"
          error={form.formState.errors.photo?.message}
        >
          <Controller
            name="photo"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <PhotoInput value={value} onChangeAction={onChange} />
            )}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          className="h-16 text-xl font-semibold"
          disabled={isPending}
        >
          {isPending ? "Enviando..." : "Confirmar agendamento"}
        </Button>
      </form>

      <EstimateDialog
        open={estimateDialog.open}
        message={estimateDialog.message}
        onContinueAction={handleDialogContinue}
      />

      <AlertDialog open={duplicateOpen} onOpenChange={setDuplicateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Placa já está na fila</AlertDialogTitle>
            <AlertDialogDescription>
              Já existe um agendamento ativo com esta placa. Deseja continuar
              mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingValues(null)}>
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingValues) submitEntry(pendingValues);
                setDuplicateOpen(false);
              }}
            >
              Continuar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-base">{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
