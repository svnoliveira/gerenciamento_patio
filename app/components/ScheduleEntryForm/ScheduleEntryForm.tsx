"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { formatCPF, formatCellphone, formatPlate } from "@/lib/formatNumbers";
import { findTrucksByPlate } from "@/lib/findTruckByPlate";
import { AreaSelect } from "../AreaSelect/AreaSelect";
import { CompanySelect } from "../CompanySelect/CompanySelect";
import { PhotoInput } from "../PhotoInput/PhotoInput";
import { compressImage } from "@/app/actions/api/client/compressImage";
import {
  createScheduleEntry,
  updateScheduleEntry,
  cancelScheduleEntry,
} from "@/app/actions/api/server/queue-entries-schedule";
import {
  scheduleEntrySchema,
  ScheduleEntryFormInput,
  ScheduleEntryFormOutput,
} from "./schema";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import {
  TRUCK_TYPES,
  CARGO_TYPE_OPTIONS,
  ITruck,
} from "@/app/interface/truck/truck";
import { IUser } from "@/app/interface/user/user";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ScheduleEntryForm({
  entry,
  currentUser,
  onDoneAction,
}: {
  entry: IQueueEntry | null; // null = creating
  currentUser: IUser;
  onDoneAction: () => void;
}) {
  const isStaff =
    currentUser.is_superuser ||
    currentUser.role === "ADMIN" ||
    currentUser.role === "OPERATOR";
  const [isPending, setIsPending] = useState(false);

  const [truckList, setTruckList] = useState<ITruck[]>([]);

  useEffect(() => {
    const fetchTruckList = async () => {
      const response = await clientApiFetch("/trucks?page_size=9999");
      const data = await response.json();
      setTruckList(data?.results || []);
    };

    fetchTruckList();
  }, []);

  const form = useForm<
    ScheduleEntryFormInput,
    unknown,
    ScheduleEntryFormOutput
  >({
    resolver: zodResolver(scheduleEntrySchema),
    defaultValues: {
      company_name:
        entry?.company_name ??
        (isStaff ? "" : (currentUser.company?.name ?? "")),
      truck_plate: entry?.truck_plate ?? "",
      truck_driver: entry?.truck_driver ?? "",
      truck_cpf: entry?.truck_cpf ?? "",
      truck_cellphone: entry?.truck_cellphone ?? "",
      truck_product: entry?.truck_product ?? "",
      truck_type: entry?.truck_type ?? "",
      truck_cargo_type: entry?.truck_cargo_type ?? ("" as never),
      area: entry?.area?.id,
      document_photo: undefined,
    },
  });

  async function handlePlateBlur() {
    const plate = form.getValues("truck_plate");
    if (!plate || plate.length < 7) return;

    try {
      const trucks = await findTrucksByPlate(plate);
      if (trucks.length === 0) return;

      const truck = trucks[0];
      form.setValue("truck_driver", truck.driver);
      form.setValue("truck_cpf", truck.cpf);
      form.setValue("truck_cellphone", truck.cellphone);
      form.setValue("truck_product", truck.product);
      form.setValue("truck_type", truck.type);
      form.setValue("truck_cargo_type", truck.cargo_type);
      if (truck.company?.name && isStaff) {
        form.setValue("company_name", truck.company.name);
      }
      toast("Dados do caminhão preenchidos automaticamente.");
    } catch {}
  }

  async function onSubmit(values: ScheduleEntryFormOutput) {
    setIsPending(true);
    try {
      const compressedDocumentPhoto = values.document_photo
        ? await compressImage(values.document_photo, values.truck_plate)
        : undefined;
      const payload = {
        ...values,
        document_photo: compressedDocumentPhoto,
      };

      if (entry) {
        await updateScheduleEntry(entry.id, payload);
        toast("Agendamento atualizado com sucesso!");
      } else {
        await createScheduleEntry(payload);
        toast("Agendamento criado com sucesso!");
      }
      onDoneAction();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Erro ao salvar agendamento",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleCancel() {
    if (!entry) return;
    setIsPending(true);
    try {
      await cancelScheduleEntry(entry.id);
      toast("Agendamento cancelado");
      onDoneAction();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Erro ao cancelar agendamento",
      );
    } finally {
      setIsPending(false);
    }
  }

  function handleDriverSelect(truck: ITruck) {
    form.setValue("truck_driver", truck.driver);
    form.setValue("truck_cpf", truck.cpf);
    form.setValue("truck_cellphone", truck.cellphone);
  }

  const cargoTypeValue = form.watch("truck_cargo_type");
  const areaValue = form.watch("area");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-md border p-4"
    >
      <h2 className="text-lg font-semibold">
        {entry ? "Editar agendamento" : "Novo agendamento"}
      </h2>

      {!entry && (
        <div className="space-y-1.5">
          <Label className="text-base">Preenchimento rápido</Label>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="w-full"
              render={<Button variant="outline">Selecione...</Button>}
            />
            <DropdownMenuContent className="max-h-[60vh] overflow-y-auto sm:max-h-80">
              {truckList.map((truck) => (
                <DropdownMenuItem
                  key={truck.id}
                  onClick={() => handleDriverSelect(truck)}
                >
                  {truck.driver}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="space-y-2">
        <Label>Empresa</Label>
        {isStaff ? (
          <Controller
            name="company_name"
            control={form.control}
            render={({ field }) => (
              <CompanySelect
                value={field.value}
                onChangeAction={field.onChange}
              />
            )}
          />
        ) : (
          <Input
            value={form.getValues("company_name")}
            disabled
            className="h-14 text-lg"
          />
        )}
        {form.formState.errors.company_name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.company_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Placa</Label>
        <Controller
          name="truck_plate"
          control={form.control}
          render={({ field }) => (
            <Input
              className="h-14 text-lg"
              placeholder="ABC1D23"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(formatPlate(e.target.value))}
              onBlur={handlePlateBlur}
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

      <div className="space-y-2">
        <Label>Motorista</Label>
        <Input className="h-14 text-lg" {...form.register("truck_driver")} />
        {form.formState.errors.truck_driver && (
          <p className="text-sm text-destructive">
            {form.formState.errors.truck_driver.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>CPF</Label>
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
        {form.formState.errors.truck_cpf && (
          <p className="text-sm text-destructive">
            {form.formState.errors.truck_cpf.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Telefone</Label>
        <Controller
          name="truck_cellphone"
          control={form.control}
          render={({ field }) => (
            <Input
              className="h-14 text-lg"
              placeholder="(00) 0 0000-0000"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(formatCellphone(e.target.value))}
            />
          )}
        />
        {form.formState.errors.truck_cellphone && (
          <p className="text-sm text-destructive">
            {form.formState.errors.truck_cellphone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Produto</Label>
        <Input className="h-14 text-lg" {...form.register("truck_product")} />
        {form.formState.errors.truck_product && (
          <p className="text-sm text-destructive">
            {form.formState.errors.truck_product.message}
          </p>
        )}
      </div>

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

      <div className="space-y-2">
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
        {form.formState.errors.truck_cargo_type && (
          <p className="text-sm text-destructive">
            {form.formState.errors.truck_cargo_type.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Área (opcional)</Label>
        <AreaSelect
          value={areaValue}
          onChangeAction={(id) =>
            form.setValue("area", id, { shouldValidate: true })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Foto do documento (opcional)</Label>
        <Controller
          name="document_photo"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <PhotoInput
              value={value}
              onChangeAction={onChange}
              document="Anexar Documento"
            />
          )}
        />
        {form.formState.errors.document_photo && (
          <p className="text-sm text-destructive">
            {form.formState.errors.document_photo.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {entry ? "Salvar" : "Criar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDoneAction}
            disabled={isPending}
          >
            Cancelar edição
          </Button>
        </div>

        {entry && (
          <AlertDialog>
            <AlertDialogTrigger
              nativeButton
              render={
                <Button type="button" variant="destructive">
                  Cancelar agendamento
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar agendamento?</AlertDialogTitle>
                <AlertDialogDescription>
                  O agendamento da placa &quot;{entry.truck_plate}&quot; será
                  cancelado e movido para o histórico.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Voltar</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </form>
  );
}
