"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { formSchema } from "./formSchema";
import { useAuth } from "@/app/hooks/auth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TUserRole } from "@/app/interface/user/user";
import { useUserStore } from "@/app/stores/useUserStore";
import { useMemo } from "react";

export const RegisterForm = () => {
  const { register } = useAuth();
  const user = useUserStore().user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
      role: "COMPANY",
      is_superuser: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await register({ ...data, role: data.role as TUserRole });

      if (res) {
        form.reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const roleValue = useWatch({ control: form.control, name: "role" });

  const items = useMemo(() => {
    return [
      { label: "Empresa", value: "COMPANY" },
      { label: "Administrador", value: "ADMIN" },
      ...(user?.is_superuser ? [{ label: "Operador", value: "OPERATOR" }] : []),
    ];
  }, [user]);

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Formulário de Cadastro de Usuários</CardTitle>
        <CardDescription>Insira dados credenciais.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nome do usuário"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-password">Senha</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Senha"
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-name">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nome do usuário"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email do usuário"
                    autoComplete="off"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-role">Posição</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="form-rhf-role" className="w-45">
                      <SelectValue placeholder="Posição">
                        {
                          items.find((item) => item.value === field.value)
                            ?.label
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {items.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {roleValue === "ADMIN" ? (
              <Controller
                name="is_superuser"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-is_superuser">
                      Senha de Administrador
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-is_superuser"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ) : (
              <div className="h-14.75" />
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Resetar
          </Button>
          <Button type="submit" form="form-rhf">
            Enviar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
