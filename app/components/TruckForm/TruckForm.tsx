"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
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
import {
  createTruck,
  updateTruck,
  deleteTruck,
} from "@/app/actions/api/server/trucks";
import { ITruck } from "@/app/interface/truck/truck";
import { truckSchema, TruckFormInput, TruckFormOutput } from "./schema";
import { formatCellphone, formatCPF, formatPlate } from "@/lib/formatNumbers";

// TODO: replace with your real Truck.Type TextChoices values
const TYPE_OPTIONS = [
  { value: "Granel", label: "Granel" },
  { value: "Bag", label: "Bag" },
  { value: "Pallet", label: "Pallet" },
];

export function TruckForm({
  truck,
  isUserAdmin,
  company_id,
  companyOptions,
  onDoneAction,
}: {
  truck: ITruck | null;
  isUserAdmin: boolean;
  company_id?: number;
  companyOptions: { value: string; label: string }[];
  onDoneAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TruckFormInput, unknown, TruckFormOutput>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      plate: truck?.plate ?? "",
      driver: truck?.driver ?? "",
      cpf: truck?.cpf ?? "",
      cellphone: truck?.cellphone ?? "",
      product: truck?.product ?? "",
      type: truck?.type ?? "",
      company: truck?.company?.id ?? undefined,
    },
  });

  function onSubmit(values: TruckFormOutput) {
    startTransition(async () => {
      try {
        if (truck) {
          await updateTruck(truck.id, values);
          toast("Caminhão atualizado com sucesso!");
        } else {
          await createTruck(values);
          form.reset();
          toast("Caminhão criado com sucesso!");
        }
        onDoneAction();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Erro ao salvar caminhão",
        );
      }
    });
  }

  function handleDelete() {
    if (!truck) return;
    startTransition(async () => {
      try {
        await deleteTruck(truck.id);
        toast("Caminhão excluído");
        onDoneAction();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Erro ao excluir caminhão",
        );
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-md border p-4"
    >
      <h2 className="text-lg font-semibold">
        {truck ? "Editar caminhão" : "Novo caminhão"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plate">Placa</Label>
          <Input
            id="plate"
            {...form.register("plate")}
            onChange={(e) =>
              form.setValue("plate", formatPlate(e.target.value), {
                shouldValidate: true,
              })
            }
            maxLength={7}
          />
          {form.formState.errors.plate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.plate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver">Motorista</Label>
          <Input id="driver" {...form.register("driver")} />
          {form.formState.errors.driver && (
            <p className="text-sm text-destructive">
              {form.formState.errors.driver.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            value={form.watch("cpf") ?? ""}
            onChange={(e) =>
              form.setValue("cpf", formatCPF(e.target.value), {
                shouldValidate: true,
              })
            }
          />
          {form.formState.errors.cpf && (
            <p className="text-sm text-destructive">
              {form.formState.errors.cpf.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cellphone">Telefone</Label>
          <Input
            id="cellphone"
            placeholder="(00) 0 0000-0000"
            value={form.watch("cellphone") ?? ""}
            onChange={(e) =>
              form.setValue("cellphone", formatCellphone(e.target.value), {
                shouldValidate: true,
              })
            }
          />
          {form.formState.errors.cellphone && (
            <p className="text-sm text-destructive">
              {form.formState.errors.cellphone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product">Produto</Label>
          <Input id="product" {...form.register("product")} />
          {form.formState.errors.product && (
            <p className="text-sm text-destructive">
              {form.formState.errors.product.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select
            value={form.watch("type")}
            onValueChange={(value) =>
              form.setValue("type", value || "", { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tipo">
                {
                  TYPE_OPTIONS.find((opt) => opt.value === form.watch("type"))
                    ?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-destructive">
              {form.formState.errors.type.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Empresa</Label>
          <Select
            value={form.watch("company")?.toString() ?? ""}
            onValueChange={(value) =>
              form.setValue("company", Number(value), { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Empresa">
                {
                  companyOptions.find(
                    (opt) => opt.value === form.watch("company")?.toString(),
                  )?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {companyOptions
                .filter(
                  (company) =>
                    isUserAdmin || company_id === Number(company.value),
                )
                .map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {form.formState.errors.company && (
            <p className="text-sm text-destructive">
              {form.formState.errors.company.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {truck ? "Salvar" : "Criar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDoneAction}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>

        {truck && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button type="button" variant="destructive">
                  Excluir
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir caminhão?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O caminhão &quot;
                  {truck.plate}&quot; será removido permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
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
