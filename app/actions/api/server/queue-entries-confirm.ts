"use server";

import { confirmQueueEntryDetails, moveToYard } from "./queue-entries";
import { QueueEntryCompleteFormValues } from "@/app/components/QueueEntryConfirmForm/schema";

export async function completeScheduledEntry(
  id: number,
  values: QueueEntryCompleteFormValues,
  needsArea: boolean,
) {
  await confirmQueueEntryDetails(id, {
    job: values.job,
    photo: values.photo,
    document_photo: values.document_photo,
    ...(needsArea ? { area: values.area } : {}),
  });

  const result = await moveToYard(id);
  return result;
}
