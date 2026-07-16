"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { revalidatePath } from "next/cache";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export interface ImportResult {
  created_companies: number;
  created_trucks: number;
  updated_trucks: number;
  errors: string[];
  total_rows: number;
}

export async function importExcel(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await serverApiFetch("/integrations/excel-import/", {
    method: "POST",
    body: formData,
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao importar planilha"),
    );

  const result = await res.json();
  revalidatePath("/dashboard/trucks");
  revalidatePath("/dashboard/companies");
  return result;
}

export async function syncExternalApi(): Promise<ImportResult> {
  const res = await serverApiFetch("/integrations/external-sync/", {
    method: "POST",
  });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao sincronizar"));

  const result = await res.json();
  revalidatePath("/dashboard/trucks");
  revalidatePath("/dashboard/companies");
  return result;
}
