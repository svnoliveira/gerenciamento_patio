"use client";

import { useState, useEffect } from "react";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function usePaginatedList<T>(
  endpoint: string,
  page: number,
  pageSize = 10,
) {
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolvedKey, setResolvedKey] = useState<string | null>(null);

  const requestKey = `${endpoint}?page=${page}&page_size=${pageSize}`;

  useEffect(() => {
    const controller = new AbortController();

    clientApiFetch(requestKey, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch list");
        return res.json();
      })
      .then((json: PaginatedResponse<T>) => {
        setData(json);
        setError(null);
        setResolvedKey(requestKey);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
        setResolvedKey(requestKey);
      });

    return () => controller.abort();
  }, [requestKey]);

  const isLoading = resolvedKey !== requestKey;

  return { data, isLoading, error };
}
