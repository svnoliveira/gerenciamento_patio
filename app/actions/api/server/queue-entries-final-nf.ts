"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { revalidatePath } from "next/cache";

export async function setFinalNf(id: number, file: File | null) {
  const formData = new FormData();
  if (file) formData.append("final_nf", file, file.name);
  else formData.append("final_nf", "");

  const res = await serverApiFetch(`/queue-entries/${id}/edit/`, {
    method: "PATCH",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(
      await getApiErrorMessage(res, "Falha ao salvar o arquivo da NF"),
    );
  }

  revalidatePath("/dashboard/queue-entries");
  return res.json();
}

export async function uploadFinalNf(id: number, file: File) {
  return setFinalNf(id, file);
}
