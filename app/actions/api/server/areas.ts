"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { revalidatePath } from "next/cache";

export interface AreaInput {
  name: string;
  capacity: number;
}

export async function createArea(data: AreaInput) {
  const res = await serverApiFetch("/areas/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao criar área"));

  revalidatePath("/dashboard/areas");
  return res.json();
}

export async function updateArea(id: number, data: AreaInput) {
  const res = await serverApiFetch(`/areas/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao atualizar área"));

  revalidatePath("/dashboard/areas");
  return res.json();
}

export async function deleteArea(id: number) {
  const res = await serverApiFetch(`/areas/${id}/`, { method: "DELETE" });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao excluir área"));

  revalidatePath("/dashboard/areas");
}
