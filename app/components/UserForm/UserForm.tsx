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
  createUser,
  updateUser,
  deleteUser,
} from "@/app/actions/api/server/users";
import { IUser } from "@/app/interface/user/user";
import { userSchema } from "./userSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ICompany } from "@/app/interface/company/company";

type FormValues = z.infer<typeof userSchema>;
type FormInput = z.input<typeof userSchema>;
type FormOutput = z.output<typeof userSchema>;

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Administrador" },
  { value: "OPERATOR", label: "Operador" },
  { value: "COMPANY", label: "Empresa" },
];

export function UserForm({
  user,
  companies,
  onDone,
}: {
  user: IUser | null;
  companies: ICompany[];
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "",
      is_superuser: "",
      company: user?.company?.id ?? 0,
    },
  });

  const roleValue = form.watch("role");
  const companyValue = form.watch("company");

  const COMPANY_OPTIONS = [
    ...companies?.map((company) => {
      return { value: company.id, label: company.name };
    }),
    { value: 0, label: "Nenhuma" },
  ];

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        if (user) {
          await updateUser(user.id, values);
          toast("Usuário atualizada com sucesso!");
        } else {
          await createUser(values);
          toast("Usuário criada com sucesso!");
        }
        onDone();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Erro ao salvar usuário",
        );
      }
    });
  }

  function handleDelete() {
    if (!user) return;
    startTransition(async () => {
      try {
        await deleteUser(user.id);
        toast("Usuário excluída");
        onDone();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Erro ao excluir usuário",
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
        {user ? "Editar usuário" : "Nova usuário"}
      </h2>

      <div className="space-y-2">
        <Label htmlFor="username">Usuário</Label>
        <Input id="username" {...form.register("username")} />
        {form.formState.errors.username && (
          <p className="text-sm text-destructive">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

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
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Posição</Label>
        <Select
          value={form.watch("role")}
          onValueChange={(value) =>
            form.setValue("role", value || "", { shouldValidate: true })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tipo">
              {ROLE_OPTIONS.find((opt) => opt.value === roleValue)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.role && (
          <p className="text-sm text-destructive">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>

      {roleValue === "ADMIN" ? (
        <div className="space-y-2">
          <Label htmlFor="is_superuser">Senha de administrador</Label>
          <Input
            id="is_superuser"
            type="password"
            {...form.register("is_superuser")}
          />
          {form.formState.errors.is_superuser && (
            <p className="text-sm text-destructive">
              {form.formState.errors.is_superuser.message}
            </p>
          )}
        </div>
      ) : (
        <div className="h-14" />
      )}

      <div className="space-y-2">
        <Label>Empresa</Label>
        <Select
          value={form.watch("company")}
          onValueChange={(value) =>
            form.setValue("company", value || 0, { shouldValidate: true })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tipo">
              {companies.find((company) => company.id === companyValue)?.name ??
                "Nenhuma"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COMPANY_OPTIONS.map((opt) => (
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

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {user ? "Salvar" : "Criar"}
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

        {user && (
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
                <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A usuário &quot;{user.name}
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
