"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { revalidatePath } from "next/cache";

async function callAction(
  path: string,
  method: "POST" | "PATCH",
  body?: FormData | Record<string, unknown>,
) {
  const isFormData = body instanceof FormData;

  const res = await serverApiFetch(path, {
    method,
    ...(body
      ? {
          body: isFormData ? body : JSON.stringify(body),
          headers: isFormData
            ? undefined
            : { "Content-Type": "application/json" },
        }
      : {}),
  });

  if (!res.ok) {
    const text = await res.clone().text();
    console.error("queue action failed:", path, res.status, text);
    throw new Error(
      await getApiErrorMessage(res, "Falha ao atualizar registro"),
    );
  }
  return res.json();
}

function revalidateQueue() {
  revalidatePath("/queue");
  revalidatePath("/dashboard/queue-entries");
  revalidatePath("/dashboard/agendamentos");
}

export async function confirmQueueEntryDetails(
  id: number,
  data: { area?: number; job?: string; photo?: File },
) {
  const formData = new FormData();
  if (data.area !== undefined) formData.append("area", String(data.area));
  if (data.job !== undefined) formData.append("job", data.job);
  if (data.photo !== undefined)
    formData.append("photo", data.photo, data.photo.name);

  const result = await callAction(
    `/queue-entries/${id}/confirm/`,
    "PATCH",
    formData,
  );
  revalidateQueue();
  return result;
}

export async function moveToYard(id: number) {
  const result = await callAction(
    `/queue-entries/${id}/move-to-yard/`,
    "PATCH",
  );
  revalidateQueue();
  return result;
}

export async function startOperation(id: number) {
  const result = await callAction(
    `/queue-entries/${id}/start-operation/`,
    "PATCH",
  );
  revalidateQueue();
  return result;
}

export async function awaitConclusion(id: number) {
  const result = await callAction(
    `/queue-entries/${id}/await-conclusion/`,
    "PATCH",
  );
  revalidateQueue();
  return result;
}

export async function finish(id: number) {
  const result = await callAction(`/queue-entries/${id}/finish/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function cancel(id: number) {
  const result = await callAction(`/queue-entries/${id}/cancel/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function setStatus(
  id: number,
  status: string,
  extra?: { area?: number; job?: string; photo?: File },
) {
  const formData = new FormData();
  formData.append("status", status);
  if (extra?.area !== undefined) formData.append("area", String(extra.area));
  if (extra?.job !== undefined) formData.append("job", extra.job);
  if (extra?.photo !== undefined)
    formData.append("photo", extra.photo, extra.photo.name);

  const result = await callAction(
    `/queue-entries/${id}/set-status/`,
    "PATCH",
    formData,
  );
  revalidateQueue();
  return result;
}

export async function clearOrder(id: number) {
  const result = await callAction(`/queue-entries/${id}/clear-order/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function newOrder(id: number) {
  const result = await callAction(`/queue-entries/${id}/new-order/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function setOrder(id: number, order: number) {
  const result = await callAction(
    `/queue-entries/${id}/set-order/${order}/`,
    "PATCH",
  );
  revalidateQueue();
  return result;
}

export async function normalizeQueue(areaId: number) {
  const result = await callAction("/queue-entries/normalize/", "PATCH", {
    area: areaId,
  });
  revalidateQueue();
  return result;
}
