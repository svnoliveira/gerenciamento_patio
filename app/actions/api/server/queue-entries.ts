"use server";

import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { revalidatePath } from "next/cache";

async function callAction(path: string, method: "POST" | "PATCH") {
  const res = await serverApiFetch(path, { method });
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
}

export async function newOrder(id: number) {
  const result = await callAction(`/queue-entries/${id}/new-order/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function assignArea(id: number, areaId: number) {
  const result = await callAction(
    `/queue-entries/${id}/assign-area/${areaId}/`,
    "PATCH",
  );
  revalidateQueue();
  return result;
}

export async function standby(id: number) {
  const result = await callAction(`/queue-entries/${id}/standby/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function start(id: number) {
  const result = await callAction(`/queue-entries/${id}/start/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function finish(id: number) {
  const result = await callAction(`/queue-entries/${id}/finish/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function wait(id: number) {
  const result = await callAction(`/queue-entries/${id}/wait/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function cancel(id: number) {
  const result = await callAction(`/queue-entries/${id}/cancel/`, "PATCH");
  revalidateQueue();
  return result;
}

export async function clearOrder(id: number) {
  const result = await callAction(`/queue-entries/${id}/clear-order/`, "PATCH");
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

export async function moveToArea(id: number, areaId: number) {
  const result = await callAction(
    `/queue-entries/${id}/move-to-area/${areaId}/`,
    "POST",
  );
  revalidateQueue();
  return result;
}

export async function moveToWaiting(id: number, newPosition: number) {
  await wait(id);
  await setOrder(id, newPosition);
}

export async function flagStandbyWhileInside(id: number) {
  await standby(id);
}
