"use client";

import { Button } from "@/app/components/ui/button";
import { TQueueListFilter } from "@/app/interface/queue_entry/queue_entry";

const FILTERS: { value: TQueueListFilter; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "SCHEDULED", label: "Agendados" },
  { value: "ON_YARD", label: "No pátio" },
  { value: "AWAITING_CONCLUSION", label: "Aguardando NF" },
];

export function QueueFilterTabs({
  value,
  onChangeAction,
}: {
  value: TQueueListFilter;
  onChangeAction: (filter: TQueueListFilter) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-center pb-1">
      {FILTERS.map((f) => (
        <Button
          key={f.value}
          size="sm"
          variant={value === f.value ? "secondary" : "ghost"}
          className="shrink-0"
          onClick={() => onChangeAction(f.value)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}
