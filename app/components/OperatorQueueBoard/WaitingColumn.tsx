"use client";

import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QueueCard } from "@/app/components/QueueCard/QueueCard";
import { CancelConfirmDialog } from "./CancelConfirmDialog";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";

function SortableCard({
  entry,
  onClick,
}: {
  entry: IQueueEntry;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(entry.id),
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="touch-none"
    >
      <QueueCard entry={entry} />
    </div>
  );
}

export function WaitingColumn({
  entries,
  onCancel,
}: {
  entries: IQueueEntry[];
  onCancel: (id: number) => void;
}) {
  const [cancelTarget, setCancelTarget] = useState<IQueueEntry | null>(null);

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
      <h2 className="text-lg font-semibold">Aguardando ({entries.length})</h2>
      <SortableContext
        items={entries.map((e) => String(e.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum caminhão aguardando.
            </p>
          ) : (
            entries.map((entry) => (
              <SortableCard
                key={entry.id}
                entry={entry}
                onClick={() => setCancelTarget(entry)}
              />
            ))
          )}
        </div>
      </SortableContext>

      <CancelConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        plate={cancelTarget?.truck_plate ?? ""}
        onConfirm={() => {
          if (cancelTarget) onCancel(cancelTarget.id);
          setCancelTarget(null);
        }}
      />
    </div>
  );
}
