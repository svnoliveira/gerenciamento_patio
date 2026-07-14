"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { revalidatePath } from "next/cache";

export interface UserInput {
  username: string;
  name: string;
  email: string;
  role: string;
  is_superuser?: string | undefined;
  company?: number;
}

export async function createUser(data: UserInput) {
  const res = await serverApiFetch("/users/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao criar usuário"));

  revalidatePath("/dashboard/users");
  return res.json();
}

export async function updateUser(id: number, data: UserInput) {
  console.log(JSON.stringify(data));
  const res = await serverApiFetch(`/users/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, company_id: data.company }),
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao atualizar usuário"),
    );

  revalidatePath("/dashboard/users");
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await serverApiFetch(`/users/${id}/`, { method: "DELETE" });

  if (!res.ok)
    throw new Error(await getApiErrorMessage(res, "Falha ao excluir usuário"));

  revalidatePath("/dashboard/users");
}
