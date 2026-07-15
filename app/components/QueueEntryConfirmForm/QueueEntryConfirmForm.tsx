"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useTransition } from "react";
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
import { formatPlate } from "@/lib/formatNumbers";
import { checkDuplicatePlate } from "@/lib/checkDuplicatePlate";
import {
  QueueEntryConfirmSchema,
  QueueEntryConfirmFormInput,
  QueueEntryConfirmFormOutput,
} from "./schema";
import { ITruck } from "@/app/interface/truck/truck";
import { findTrucksByPlate } from "@/lib/findTruckByPlate";
import { QueueEntryForm } from "../QueueEntryForm/QueueEntryForm";
import { PhotoInput } from "../PhotoInput/PhotoInput";

const JOB_OPTIONS = [
  { value: "Carga", label: "Carga" },
  { value: "Descarga", label: "Descarga" },
];

export function QueueEntryConfirmForm() {
  const [isPending, startTransition] = useTransition();
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<QueueEntryConfirmFormOutput | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<ITruck | null>();

  const form = useForm<
    QueueEntryConfirmFormInput,
    unknown,
    QueueEntryConfirmFormOutput
  >({
    resolver: zodResolver(QueueEntryConfirmSchema),
    defaultValues: {
      truck_plate: "",
      job: "" as never,
      photo: undefined,
    },
  });

  async function submitEntry(values: QueueEntryConfirmFormOutput) {
    startTransition(async () => {
      try {
        const trucks = await findTrucksByPlate(values.truck_plate);
        if (trucks.length < 1) {
          throw new Error("Nenhum caminhão cadastrado com esta placa.");
        }
        toast("Placa encontrada!");
        setSelectedTruck(trucks[0]);
        //TODO: if there are more than 1 trucks, show a warning
      } catch (error) {
        toast(
          error instanceof Error
            ? error.message
            : "Erro ao registrar agendamento",
        );
      }
    });
  }

  async function onSubmit(values: QueueEntryConfirmFormOutput) {
    const isDuplicate = await checkDuplicatePlate(values.truck_plate);
    if (isDuplicate) {
      setPendingValues(values);
      setDuplicateOpen(true);
      return;
    }
    submitEntry(values);
  }

  const jobValue = useWatch({ control: form.control, name: "job" });
  const photoValue = useWatch({ control: form.control, name: "photo" });

  const preRegisteredTruck = useMemo(() => {
    if (selectedTruck && jobValue && photoValue) {
      return { ...selectedTruck, job: jobValue, photo: photoValue };
    }
    return null;
  }, [jobValue, photoValue, selectedTruck]);

  return (
    <>
      {!preRegisteredTruck ? (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex w-full max-w-md flex-col gap-5"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Confirmar agendamento
          </h1>

          <Field
            label="Placa"
            error={form.formState.errors.truck_plate?.message}
          >
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
            {isPending ? "Enviando..." : "Procurar Placa"}
          </Button>
        </form>
      ) : (
        <QueueEntryForm
          data={preRegisteredTruck}
          onSuccessAction={() => {
            form.reset();
            setSelectedTruck(null);
          }}
        />
      )}

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
