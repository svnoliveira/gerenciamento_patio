import z from "zod";

export const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  capacity: z.coerce
    .number()
    .int()
    .positive("Capacidade deve ser maior que zero"),
});
