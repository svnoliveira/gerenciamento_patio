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
  name: z
    .string()
    .min(2, "Nome precisa ter pelo menos 2 caracteres.")
    .max(100, "Nome precisa ter no máximo 100 caracteres."),
  email: z.email("Email precisa ser válido."),
  role: z.string().min(4, "Posição precisa ser preenchida."),
  is_superuser: z.string().optional(),
});
