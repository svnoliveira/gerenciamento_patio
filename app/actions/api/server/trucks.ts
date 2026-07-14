"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { revalidatePath } from "next/cache";
import { TruckFormOutput } from "@/app/components/TruckForm/schema";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export async function createTruck(data: TruckFormOutput) {
  const res = await serverApiFetch("/trucks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao criar caminhão"));

  revalidatePath("/dashboard/trucks");
  return res.json();
}

export async function updateTruck(id: string, data: TruckFormOutput) {
  const res = await serverApiFetch(`/trucks/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao atualizar caminhão"),
    );

  revalidatePath("/dashboard/trucks");
  return res.json();
}

export async function deleteTruck(id: string) {
  const res = await serverApiFetch(`/trucks/${id}/`, { method: "DELETE" });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao excluir caminhão"));

  revalidatePath("/dashboard/trucks");
}
