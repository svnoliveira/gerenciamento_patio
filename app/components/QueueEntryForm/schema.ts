import { z } from "zod";

const plateRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cellphoneRegex = /^\(\d{2}\) \d \d{4}-\d{4}$/;

export const queueEntrySchema = z.object({
  company_name: z.string().min(1, "Nome da empresa é obrigatório"),
  truck_plate: z
    .string()
    .regex(plateRegex, "Placa inválida. Use o formato ABC1D23"),
  truck_driver: z.string().min(1, "Motorista é obrigatório"),
  truck_cpf: z
    .string()
    .regex(cpfRegex, "CPF inválido. Use o formato 000.000.000-00"),
  truck_cellphone: z
    .string()
    .regex(cellphoneRegex, "Telefone inválido. Use o formato (00) 0 0000-0000"),
  truck_product: z.string().min(1, "Produto é obrigatório"),
  truck_type: z.string().min(1, "Tipo é obrigatório"),
  job: z.enum(["Carga", "Descarga"], { message: "Selecione uma operação" }),
  truck_granel: z.coerce.number().optional(),
  truck_bag: z.coerce.number().optional(),
  truck_pallet: z.coerce.number().optional(),
  photo: z
    .instanceof(File, { message: "Foto é obrigatória" })
    .refine((file) => file.size > 0, "Foto é obrigatória"),
});

export type QueueEntryFormInput = z.input<typeof queueEntrySchema>;
export type QueueEntryFormOutput = z.output<typeof queueEntrySchema>;
