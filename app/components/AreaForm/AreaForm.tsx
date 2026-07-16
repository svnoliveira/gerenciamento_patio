"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
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
  createArea,
  updateArea,
  deleteArea,
} from "@/app/actions/api/server/areas";
import { IArea } from "@/app/interface/area/area";
import { schema } from "./areaSchema";

type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function AreaForm({
  area,
  onDoneAction,
}: {
  area: IArea | null;
  onDoneAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: area?.name ?? "",
      capacity: area?.capacity ?? 0,
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        if (area) {
          await updateArea(area.id, values);
          form.reset();
          toast("Área atualizada com sucesso!");
        } else {
          await createArea(values);
          toast("Área criada com sucesso!");
        }
        onDoneAction();
      } catch (error) {
        toast(error instanceof Error ? error.message : "Erro ao salvar área");
      }
    });
  }

  function handleDelete() {
    if (!area) return;
    startTransition(async () => {
      try {
        await deleteArea(area.id);
        toast("Área excluída");
        onDoneAction();
      } catch (error) {
        toast(error instanceof Error ? error.message : "Erro ao excluir área");
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-md border p-4"
    >
      <h2 className="text-lg font-semibold">
        {area ? "Editar área" : "Nova área"}
      </h2>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacidade</Label>
        <Input id="capacity" type="number" {...form.register("capacity")} />
        {form.formState.errors.capacity && (
          <p className="text-sm text-destructive">
            {form.formState.errors.capacity.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {area ? "Salvar" : "Criar"}
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

        {area && (
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
                <AlertDialogTitle>Excluir área?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A área &quot;{area.name}
                  &quot; será removida permanentemente.
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
