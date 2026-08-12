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
  document_photo?: File;
}

function revalidateSchedule() {
  revalidatePath("/dashboard/schedule");
  revalidatePath("/queue");
}

export async function createScheduleEntry(values: ScheduleEntryInput) {
  const hasDocumentPhoto = values.document_photo !== undefined;
  const body = hasDocumentPhoto
    ? buildScheduleFormData(values)
    : JSON.stringify(values);

  const res = await serverApiFetch("/queue-entries/", {
    method: "POST",
    ...(hasDocumentPhoto
      ? { body }
      : { headers: { "Content-Type": "application/json" }, body }),
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
  const hasDocumentPhoto = values.document_photo !== undefined;
  const body = hasDocumentPhoto
    ? buildScheduleFormData(values)
    : JSON.stringify(values);

  const res = await serverApiFetch(`/queue-entries/${id}/schedule/`, {
    method: "PATCH",
    ...(hasDocumentPhoto
      ? { body }
      : { headers: { "Content-Type": "application/json" }, body }),
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao atualizar agendamento"),
    );

  revalidateSchedule();
  return res.json();
}

function buildScheduleFormData(values: ScheduleEntryInput) {
  const formData = new FormData();
  formData.append("company_name", values.company_name);
  formData.append("truck_plate", values.truck_plate);
  formData.append("truck_driver", values.truck_driver);
  formData.append("truck_cpf", values.truck_cpf);
  formData.append("truck_cellphone", values.truck_cellphone);
  formData.append("truck_product", values.truck_product);
  formData.append("truck_type", values.truck_type);
  formData.append("truck_cargo_type", values.truck_cargo_type);
  if (values.area !== undefined) {
    formData.append("area", String(values.area));
  }
  if (values.document_photo !== undefined) {
    formData.append(
      "document_photo",
      values.document_photo,
      values.document_photo.name,
    );
  }

  return formData;
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
