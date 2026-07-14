"use client";

import { refreshRequest } from "@/app/actions/api/client/auth";
import { getCsrfToken } from "@/lib/getCrsfToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<boolean> | null = null;

export async function clientApiFetch(path: string, options: RequestInit = {}) {
  const doFetch = () =>
    fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        ...(options.method && options.method !== "GET"
          ? { "X-CSRFToken": getCsrfToken() }
          : {}),
      },
    });

  let res = await doFetch();

  if (res.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshRequest().finally(() => {
        refreshPromise = null;
      });
    }
    const refreshed = await refreshPromise;

    if (refreshed) {
      res = await doFetch();
    }
  }

  return res;
}
