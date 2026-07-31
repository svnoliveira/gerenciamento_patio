"use server";

import { confirmQueueEntryDetails, moveToYard } from "./queue-entries";
import { QueueEntryCompleteFormOutput } from "@/app/components/QueueEntryConfirmForm/schema";

export async function completeScheduledEntry(
  id: number,
  values: QueueEntryCompleteFormOutput,
  needsArea: boolean,
) {
  await confirmQueueEntryDetails(id, {
    job: values.job,
    photo: values.photo,
    ...(needsArea ? { area: values.area } : {}),
  });

  const result = await moveToYard(id);
  return result;
}
