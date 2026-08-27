import { z } from "zod";

export const queueEntryCompleteBaseSchema = z.object({
  job: z.enum(["Carga", "Descarga"], { message: "Selecione uma operação" }),
  area: z.number().optional(),
  photo: z
    .instanceof(File, { message: "Foto é obrigatória" })
    .refine((file) => file.size > 0, "Foto é obrigatória"),
  document_photo: z
    .instanceof(File, {
      message: "Foto do documento deve ser um arquivo válido",
    })
    .optional(),
});

export function buildQueueEntryCompleteSchema(needsArea: boolean) {
  return queueEntryCompleteBaseSchema.superRefine((data, ctx) => {
    if (needsArea && !data.area) {
      ctx.addIssue({
        code: "custom",
        message: "Selecione uma área",
        path: ["area"],
      });
    }
    // if (!hasDocumentPhoto && !data.document_photo) {
    //   ctx.addIssue({
    //     code: "custom",
    //     message: "Foto do documento é obrigatória",
    //     path: ["document_photo"],
    //   });
    // }
  });
}

export type QueueEntryCompleteFormValues = z.infer<
  typeof queueEntryCompleteBaseSchema
>;
