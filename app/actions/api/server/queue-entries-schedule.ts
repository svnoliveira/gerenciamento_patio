"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { revalidatePath } from "next/cache";

export interface ScheduleEntryInput {
  company_name: string;
  truck_plate: string;
  truck_driver: string;
  truck_cpf: string;
  truck_cellphone: string;
  truck_product: string;
  truck_type: string;
  truck_cargo_type: "Granel" | "Bag" | "Pallet";
  area?: number;
}

function revalidateSchedule() {
  revalidatePath("/dashboard/schedule");
  revalidatePath("/queue");
}

export async function createScheduleEntry(values: ScheduleEntryInput) {
  const res = await serverApiFetch("/queue-entries/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao criar agendamento"),
    );

  revalidateSchedule();
  return res.json();
}

export async function updateScheduleEntry(
  id: number,
  values: ScheduleEntryInput,
) {
  const res = await serverApiFetch(`/queue-entries/${id}/schedule/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao atualizar agendamento"),
    );

  revalidateSchedule();
  return res.json();
}

export async function cancelScheduleEntry(id: number) {
  const res = await serverApiFetch(`/queue-entries/${id}/cancel/`, {
    method: "PATCH",
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao cancelar agendamento"),
    );

  revalidateSchedule();
  return res.json();
}
