import z from "zod";

export const formSchema = z.object({
  username: z
    .string()
    .min(5, "Username precisa ter pelo menos 5 caracteres.")
    .max(32, "Username precisa ter no máximo 32 caracteres."),
  password: z
    .string()
    .min(4, "Senha precisa ter pelo menos 4 caracteres.")
    .max(100, "Senha precisa ter no máximo 100 caracteres."),
});
