"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { revalidatePath } from "next/cache";

export interface CompanyInput {
  name: string;
}

export async function createCompany(data: CompanyInput) {
  const res = await serverApiFetch("/companies/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao criar empresa"));

  revalidatePath("/dashboard/companies");
  return res.json();
}

export async function updateCompany(id: number, data: CompanyInput) {
  const res = await serverApiFetch(`/companies/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao atualizar empresa"),
    );

  revalidatePath("/dashboard/companies");
  return res.json();
}

export async function deleteCompany(id: number) {
  const res = await serverApiFetch(`/companies/${id}/`, { method: "DELETE" });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao excluir empresa"));

  revalidatePath("/dashboard/companies");
}
