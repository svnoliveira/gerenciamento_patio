"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const success = await login(data);
      if (success) {
        form.reset();
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Formulário de Login</CardTitle>
        <CardDescription>
          Por favor, insira suas credenciais de login.
        </CardDescription>
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
                    placeholder="Enter your username"
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
                    placeholder="Enter your password"
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
