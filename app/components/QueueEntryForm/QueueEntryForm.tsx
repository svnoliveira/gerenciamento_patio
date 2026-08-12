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
import { formatCPF, formatCellphone, formatPlate } from "@/lib/formatNumbers";
import { checkDuplicatePlate } from "@/lib/checkDuplicatePlate";
import { createWalkUpQueueEntry } from "@/app/actions/api/server/queue-entries-walkup";
import {
  queueEntryWalkUpSchema,
  QueueEntryWalkUpFormInput,
  QueueEntryWalkUpFormOutput,
} from "./schema";
import { PhotoInput } from "../PhotoInput/PhotoInput";
import { AreaSelect } from "../AreaSelect/AreaSelect";
import { EstimateDialog } from "../QueueEntryForm/EstimateDialog";
import { compressImage } from "@/app/actions/api/client/compressImage";
import { TRUCK_TYPES, CARGO_TYPE_OPTIONS } from "@/app/interface/truck/truck";
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

const JOB_OPTIONS = [
  { value: "Carga", label: "Carga" },
  { value: "Descarga", label: "Descarga" },
];

export function QueueEntryWalkUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<QueueEntryWalkUpFormOutput | null>(null);
  const [estimateDialog, setEstimateDialog] = useState<{
    open: boolean;
    message: string | null;
    entryId: number | null;
  }>({ open: false, message: null, entryId: null });

  const form = useForm<
    QueueEntryWalkUpFormInput,
    unknown,
    QueueEntryWalkUpFormOutput
  >({
    resolver: zodResolver(queueEntryWalkUpSchema),
    defaultValues: {
      company_name: "",
      truck_plate: "",
      truck_driver: "",
      truck_cpf: "",
      truck_cellphone: "",
      truck_product: "",
      truck_type: "",
      truck_cargo_type: "" as never,
      job: "" as never,
      area: undefined,
      photo: undefined,
      document_photo: undefined,
    },
  });

  // const truckTypeValue = useWatch({
  //   control: form.control,
  //   name: "truck_type",
  // });
  const cargoTypeValue = useWatch({
    control: form.control,
    name: "truck_cargo_type",
  });
  const jobValue = useWatch({ control: form.control, name: "job" });
  const areaValue = useWatch({ control: form.control, name: "area" });

  async function submitEntry(values: QueueEntryWalkUpFormOutput) {
    startTransition(async () => {
      try {
        const compressedPhoto = await compressImage(
          values.photo,
          values.truck_plate,
        );
        const compressedDocumentPhoto = await compressImage(
          values.document_photo,
          values.truck_plate,
        );
        const result = await createWalkUpQueueEntry(
          values,
          compressedPhoto,
          compressedDocumentPhoto,
        );
        toast("Caminhão registrado e confirmado no pátio!");
        form.reset();

        setEstimateDialog({
          open: true,
          message: result.estimate?.message ?? null,
          entryId: result.id,
        });
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Erro ao registrar caminhão",
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

  async function onSubmit(values: QueueEntryWalkUpFormOutput) {
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
          Registrar caminhão
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

        <div className="space-y-2">
          <Label>Tipo de veículo</Label>
          <Select
            value={form.watch("truck_type") || ""}
            onValueChange={(v) =>
              form.setValue("truck_type", v || "", { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-14 w-full text-lg">
              <SelectValue placeholder="Selecione o tipo de veículo" />
            </SelectTrigger>
            <SelectContent>
              {TRUCK_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.truck_type && (
            <p className="text-sm text-destructive">
              {form.formState.errors.truck_type.message}
            </p>
          )}
        </div>

        <Field
          label="Tipo de carga"
          error={form.formState.errors.truck_cargo_type?.message}
        >
          <Select
            value={cargoTypeValue}
            onValueChange={(v) =>
              form.setValue(
                "truck_cargo_type",
                v as "Granel" | "Bag" | "Pallet",
                { shouldValidate: true },
              )
            }
          >
            <SelectTrigger className="h-14 w-full text-lg">
              <SelectValue placeholder="Selecione">
                {
                  CARGO_TYPE_OPTIONS.find((o) => o.value === cargoTypeValue)
                    ?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CARGO_TYPE_OPTIONS.map((o) => (
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

        <Field label="Área" error={form.formState.errors.area?.message}>
          <AreaSelect
            value={areaValue}
            onChangeAction={(id) =>
              form.setValue("area", id, { shouldValidate: true })
            }
          />
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

        <Field
          label="Foto do documento"
          error={form.formState.errors.document_photo?.message}
        >
          <Controller
            name="document_photo"
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
          {isPending ? "Enviando..." : "Registrar e confirmar"}
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
