import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";

export async function checkDuplicatePlate(plate: string): Promise<boolean> {
  const res = await clientApiFetch(
    `/queue-entries/?status_in=WAITING,STANDBY,INSIDE&plate=${encodeURIComponent(plate)}`,
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.results.length > 0;
}
