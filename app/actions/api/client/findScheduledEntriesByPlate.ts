import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import {
  IPaginatedQueueEntries,
  IQueueEntry,
} from "@/app/interface/queue_entry/queue_entry";

export async function findScheduledEntriesByPlate(
  plate: string,
): Promise<IQueueEntry[]> {
  const res = await clientApiFetch(
    `/queue-entries/?plate=${encodeURIComponent(plate)}&status=SCHEDULED`,
  );
  if (!res.ok) {
    throw new Error("Falha ao buscar agendamentos");
  }
  const data = (await res.json()) as IPaginatedQueueEntries;
  return data.results;
}
