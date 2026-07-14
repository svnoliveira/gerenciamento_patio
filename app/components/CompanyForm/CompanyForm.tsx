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
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/app/actions/api/server/companies";
import { ICompany } from "@/app/interface/company/company";
import { schema } from "./companySchema";

type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function CompanyForm({
  company,
  onDone,
}: {
  company: ICompany | null;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: company?.name ?? "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        if (company) {
          await updateCompany(company.id, values);
          toast("Empresa atualizada com sucesso!");
        } else {
          await createCompany(values);
          toast("Empresa criada com sucesso!");
        }
        onDone();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Erro ao salvar empresa",
        );
      }
    });
  }

  function handleDelete() {
    if (!company) return;
    startTransition(async () => {
      try {
        await deleteCompany(company.id);
        toast("Empresa excluída");
        onDone();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Erro ao excluir empresa",
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
        {company ? "Editar empresa" : "Nova empresa"}
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

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {company ? "Salvar" : "Criar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDone}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>

        {company && (
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
                <AlertDialogTitle>Excluir empresa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A empresa &quot;
                  {company.name}
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
