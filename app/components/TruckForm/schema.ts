import { z } from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cellphoneRegex = /^\(\d{2}\) \d \d{4}-\d{4}$/;
const plateRegex = /^([A-Z]{3}\d{4}|[A-Z]{3}\d[A-Z]\d{2})$/;

export const truckSchema = z.object({
  plate: z
    .string()
    .regex(plateRegex, "Placa inválida. Use o formato ABC1D23 ou ABC1234"),
  driver: z.string().min(1, "Motorista é obrigatório"),
  cpf: z.string().regex(cpfRegex, "CPF inválido, use o formato 000.000.000-00"),
  cellphone: z
    .string()
    .regex(cellphoneRegex, "Telefone inválido, use o formato (00) 0 0000-0000"),
  product: z.string().min(1, "Produto é obrigatório"),
  cargo_type: z.string().min(1, "Tipo de carga é obrigatório"),
  type: z.string().min(1, "Tipo de veículo é obrigatório"),
  company: z.coerce.number().int().positive("Selecione uma empresa"),
});

export type TruckFormInput = z.input<typeof truckSchema>;
export type TruckFormOutput = z.output<typeof truckSchema>;
