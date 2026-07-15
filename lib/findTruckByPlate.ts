import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { IPaginatedTrucks, ITruck } from "@/app/interface/truck/truck";

export async function findTrucksByPlate(plate: string): Promise<ITruck[]> {
  const res = await clientApiFetch(
    `/trucks/?exact_plate=${encodeURIComponent(plate)}`,
  );
  if (!res.ok) {
    throw new Error("Falha ao encontrar Placa registrada");
  }
  const data = (await res.json()) as IPaginatedTrucks;
  return data.results;
}
