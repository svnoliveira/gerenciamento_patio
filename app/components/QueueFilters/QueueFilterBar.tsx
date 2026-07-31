"use client";

import {
  IOrderingOption,
  STATUS_LABELS,
  TQueueFilterField,
} from "@/app/interface/queue_entry/queue_entry";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FilterBadge } from "./QueueBadge";
import { OrderingBadges } from "./OrderingBadge";

const FILTERS: TQueueFilterField[] = [
  { key: "plate", label: "Placa", type: "text" },
  { key: "driver", label: "Motorista", type: "text" },
  { key: "company_name", label: "Empresa", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: Object.entries(STATUS_LABELS).map(([key, value]) => ({
      value: key,
      label: value,
    })),
  },
  {
    key: "job",
    label: "Tipo",
    type: "select",
    options: [
      { value: "Carga", label: "Carga" },
      { value: "Descarga", label: "Descarga" },
    ],
  },
  {
    key: "created",
    label: "Data de criação",
    type: "dateRange",
    afterKey: "created_after",
    beforeKey: "created_before",
  },
];

const ORDERING_OPTIONS: IOrderingOption[] = [
  { value: "created_at", label: "Criado em" },
  { value: "start_time", label: "Início" },
  { value: "end_time", label: "Fim" },
  { value: "queue_order", label: "Ordem na fila" },
];

export function QueueFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    router.push(`${pathname}?${params}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((field) => {
        if (field.type === "dateRange") {
          return (
            <FilterBadge
              key={field.key}
              field={field}
              value=""
              valueAfter={searchParams.get(field.afterKey) ?? ""}
              valueBefore={searchParams.get(field.beforeKey) ?? ""}
              onApplyRange={(after, before) =>
                updateParams({
                  [field.afterKey]: after,
                  [field.beforeKey]: before,
                })
              }
              onClear={() =>
                updateParams({ [field.afterKey]: "", [field.beforeKey]: "" })
              }
            />
          );
        }

        return (
          <FilterBadge
            key={field.key}
            field={field}
            value={searchParams.get(field.key) ?? ""}
            onApply={(value) => updateParams({ [field.key]: value })}
            onClear={() => updateParams({ [field.key]: "" })}
          />
        );
      })}

      <div className="ml-2 h-5 w-px bg-border" />

      <OrderingBadges
        options={ORDERING_OPTIONS}
        current={searchParams.get("ordering") ?? ""}
        onChange={(value) => updateParams({ ordering: value })}
      />
    </div>
  );
}
