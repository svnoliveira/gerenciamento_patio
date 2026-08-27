"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { PhotoInput } from "../PhotoInput/PhotoInput";
import { updateQueueEntryFull } from "@/app/actions/api/server/queue-entries-edit";
import {
  queueEntryEditSchema,
  QueueEntryEditFormInput,
  QueueEntryEditFormOutput,
} from "./schema";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { TRUCK_TYPES, CARGO_TYPE_OPTIONS } from "@/app/interface/truck/truck";

const JOB_OPTIONS = [
  { value: "Carga", label: "Carga" },
  { value: "Descarga", label: "Descarga" },
];

export function QueueEntryEditForm({ entry }: { entry: IQueueEntry }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
  const [removePhoto, setRemovePhoto] = useState(false);

  const notEditable =
    entry.status !== "CANCELLED" && entry.status !== "FINISHED";

  const form = useForm<
    QueueEntryEditFormInput,
    unknown,
    QueueEntryEditFormOutput
  >({
    resolver: zodResolver(queueEntryEditSchema),
    defaultValues: {
      company_name: entry.company_name ?? "",
      truck_plate: entry.truck_plate,
      truck_driver: entry.truck_driver,
      truck_cpf: entry.truck_cpf,
      truck_cellphone: entry.truck_cellphone,
      truck_product: entry.truck_product,
      truck_type: entry.truck_type,
      truck_cargo_type: entry.truck_cargo_type,
      job: entry.job ?? undefined,
      area: entry.area?.id,
    },
  });

  const cargoTypeValue = form.watch("truck_cargo_type");
  const jobValue = form.watch("job");
  // const areaValue = form.watch("area");

  async function onSubmit(values: QueueEntryEditFormOutput) {
    setIsPending(true);
    try {
      await updateQueueEntryFull(entry.id, {
        ...values,
        job: values.job ?? null,
        photo: photoFile ?? null,
        removePhoto,
      });
      toast("Registro atualizado com sucesso!");
      router.push("/dashboard/queue-entries");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Erro ao atualizar registro",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-md flex-col gap-5"
    >
      <fieldset disabled={notEditable}>
        <h1 className="text-2xl font-bold tracking-tight">
          Editar registro #{entry.id}
        </h1>

        <div className="space-y-1.5">
          <Label>Empresa</Label>
          <Input className="h-12" {...form.register("company_name")} />
          {form.formState.errors.company_name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.company_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Placa</Label>
          <Controller
            name="truck_plate"
            control={form.control}
            render={({ field }) => (
              <Input
                className="h-12"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(formatPlate(e.target.value))}
                maxLength={7}
              />
            )}
          />
          {form.formState.errors.truck_plate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.truck_plate.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Motorista</Label>
          <Input className="h-12" {...form.register("truck_driver")} />
          {form.formState.errors.truck_driver && (
            <p className="text-sm text-destructive">
              {form.formState.errors.truck_driver.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>CPF</Label>
          <Controller
            name="truck_cpf"
            control={form.control}
            render={({ field }) => (
              <Input
                className="h-12"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(formatCPF(e.target.value))}
              />
            )}
          />
          {form.formState.errors.truck_cpf && (
            <p className="text-sm text-destructive">
              {form.formState.errors.truck_cpf.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Telefone</Label>
          <Controller
            name="truck_cellphone"
            control={form.control}
            render={({ field }) => (
              <Input
                className="h-12"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(formatCellphone(e.target.value))
                }
              />
            )}
          />
          {form.formState.errors.truck_cellphone && (
            <p className="text-sm text-destructive">
              {form.formState.errors.truck_cellphone.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Produto</Label>
          <Input className="h-12" {...form.register("truck_product")} />
          {form.formState.errors.truck_product && (
            <p className="text-sm text-destructive">
              {form.formState.errors.truck_product.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Tipo de veículo</Label>
          <Select
            value={form.watch("truck_type") || ""}
            onValueChange={(v) =>
              form.setValue("truck_type", v || "", { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-14 w-full">
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

        <div className="space-y-1.5">
          <Label>Tipo de carga</Label>
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
            <SelectTrigger className="h-12 w-full">
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
        </div>

        <div className="space-y-1.5">
          <Label>Operação</Label>
          <Select
            value={jobValue ?? ""}
            onValueChange={(v) =>
              form.setValue("job", v as "Carga" | "Descarga", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Não definida">
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
        </div>

        {/* <div className="space-y-1.5">
        <Label>Área</Label>
        <AreaSelect
          value={areaValue}
          onChangeAction={(id) =>
            form.setValue("area", id, { shouldValidate: true })
          }
        />
      </div> */}

        <div className="space-y-1.5">
          <Label>Foto do documento</Label>
          {entry.photo && !removePhoto && !photoFile && (
            <div className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span className="text-muted-foreground">Foto atual anexada</span>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => setRemovePhoto(true)}
              >
                Remover
              </Button>
            </div>
          )}
          {removePhoto && (
            <p className="text-sm text-muted-foreground">
              Foto será removida ao salvar.
            </p>
          )}
          <PhotoInput
            value={photoFile}
            onChangeAction={(file) => {
              setPhotoFile(file);
              if (file) setRemovePhoto(false);
            }}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-14 flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="h-14 flex-2 text-lg font-semibold"
            disabled={isPending}
          >
            {isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
