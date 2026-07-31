"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QueueCard } from "@/app/components/QueueCard/QueueCard";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";

function QueueListCard({
  entry,
  onClickAction,
}: {
  entry: IQueueEntry;
  onClickAction: () => void;
}) {
  const isDraggable = entry.status === "ON_YARD";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(entry.id),
    disabled: !isDraggable,
  });

  return (
    <div
      ref={setNodeRef}
      {...(isDraggable ? listeners : {})}
      {...(isDraggable ? attributes : {})}
      onClick={onClickAction}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={isDraggable ? "touch-none" : undefined}
    >
      <QueueCard entry={entry} />
    </div>
  );
}

export function QueueList({
  entries,
  onSelectAction,
}: {
  entries: IQueueEntry[];
  onSelectAction: (entry: IQueueEntry) => void;
}) {
  return (
    <SortableContext
      items={entries.map((e) => String(e.id))}
      strategy={verticalListSortingStrategy}
    >
      <div className="flex flex-col gap-2">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum caminhão nesta lista.
          </p>
        ) : (
          entries.map((entry) => (
            <QueueListCard
              key={entry.id}
              entry={entry}
              onClickAction={() => onSelectAction(entry)}
            />
          ))
        )}
      </div>
    </SortableContext>
  );
}
