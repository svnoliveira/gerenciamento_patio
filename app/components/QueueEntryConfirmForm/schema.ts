import { z } from "zod";

const plateRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;

export const QueueEntryConfirmSchema = z.object({
  truck_plate: z
    .string()
    .regex(plateRegex, "Placa inválida. Use o formato ABC1D23"),
  job: z.enum(["Carga", "Descarga"], { message: "Selecione uma operação" }),
  photo: z
    .instanceof(File, { message: "Foto é obrigatória" })
    .refine((file) => file.size > 0, "Foto é obrigatória"),
});

export type QueueEntryConfirmFormInput = z.input<
  typeof QueueEntryConfirmSchema
>;
export type QueueEntryConfirmFormOutput = z.output<
  typeof QueueEntryConfirmSchema
>;
