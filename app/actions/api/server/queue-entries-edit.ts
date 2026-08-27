"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { revalidatePath } from "next/cache";

export interface EditQueueEntryInput {
  company_name: string;
  truck_plate: string;
  truck_driver: string;
  truck_cpf: string;
  truck_cellphone: string;
  truck_product: string;
  truck_type: string;
  truck_cargo_type: "Granel" | "Bag" | "Pallet";
  job: "Carga" | "Descarga" | null;
  area?: number | null;
  photo?: File | null;
  removePhoto?: boolean;
}

export async function fetchQueueEntryForEdit(id: number) {
  const res = await serverApiFetch(`/queue-entries/${id}/edit/`);
  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao carregar registro"),
    );
  return res.json();
}

export async function updateQueueEntryFull(
  id: number,
  values: EditQueueEntryInput,
) {
  const formData = new FormData();

  formData.append("company_name", values.company_name);
  formData.append("truck_plate", values.truck_plate);
  formData.append("truck_driver", values.truck_driver);
  formData.append("truck_cpf", values.truck_cpf);
  formData.append("truck_cellphone", values.truck_cellphone);
  formData.append("truck_product", values.truck_product);
  formData.append("truck_type", values.truck_type);
  formData.append("truck_cargo_type", values.truck_cargo_type);
  if (values.job) formData.append("job", values.job);
  if (values.area) formData.append("area", String(values.area));

  if (values.removePhoto) {
    formData.append("photo", "");
  } else if (values.photo) {
    formData.append("photo", values.photo, values.photo.name);
  }

  const res = await serverApiFetch(`/queue-entries/${id}/edit/`, {
    method: "PATCH",
    body: formData,
  });

  if (!res.ok)
    throw new Error(
      await getApiErrorMessage(res, "Falha ao atualizar registro"),
    );

  revalidatePath("/dashboard/queue-entries");
  return res.json();
}
