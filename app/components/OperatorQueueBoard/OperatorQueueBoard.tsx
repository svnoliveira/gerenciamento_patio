"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
// import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import {
  cancel,
  startOperation,
  awaitConclusion,
  finish,
  setOrder,
} from "@/app/actions/api/server/queue-entries";

import { AreaTabs } from "./AreaTabs";
import { QueueFilterTabs } from "./QueueFilterTabs";
import { QueueList } from "./QueueList";

import { QueueEntryActionDialog } from "./QueueEntryActionDialog";

import { SetPositionDialog } from "./SetPositionDialog";
import { CancelConfirmDialog } from "./CancelConfirmDialog";
import { AreaStatusBadge } from "./AreaStatusBadge";
import { IArea } from "@/app/interface/area/area";
import {
  IQueueEntry,
  TQueueListFilter,
} from "@/app/interface/queue_entry/queue_entry";
import { groupBoardEntries } from "@/lib/groupQueueEntries";
import { AreaEntryActionDialog } from "./AreaEntryActionDialog";
import { AreaOperationPanel } from "./AreaOperationPanel";

const QUEUE_STATUSES = "SCHEDULED,ON_YARD,AWAITING_CONCLUSION,IN_OPERATION";
const POLL_INTERVAL_MS = 5000;

interface IBoardState {
  areas: IArea[];
  entries: IQueueEntry[];
  loading: boolean;
}

function filterQueueEntries(entries: IQueueEntry[], filter: TQueueListFilter) {
  if (filter === "ALL") return entries;
  return entries.filter((e) => e.status === filter);
}

export function OperatorQueueBoard() {
  const router = useRouter();
  const [board, setBoard] = useState<IBoardState>({
    areas: [],
    entries: [],
    loading: true,
  });
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [filter, setFilter] = useState<TQueueListFilter>("ALL");

  const [queueDialogEntry, setQueueDialogEntry] = useState<IQueueEntry | null>(
    null,
  );
  const [areaDialogEntry, setAreaDialogEntry] = useState<IQueueEntry | null>(
    null,
  );
  const [positionEntry, setPositionEntry] = useState<IQueueEntry | null>(null);
  const [cancelTarget, setCancelTarget] = useState<IQueueEntry | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const fetchAreas = useCallback(async () => {
    const res = await clientApiFetch("/areas/?page_size=100");
    if (res.ok) {
      const data = await res.json();
      setBoard((prev) => ({ ...prev, areas: data.results }));
      if (data.results.length > 0 && selectedAreaId === null) {
        setSelectedAreaId(data.results[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once on mount
  }, []);

  const fetchEntries = useCallback(async (areaId: number) => {
    const res = await clientApiFetch(
      `/queue-entries/?area=${areaId}&status_in=${QUEUE_STATUSES}&ordering=queue_order&page_size=100`,
    );
    const entries = res.ok ? (await res.json()).results : [];
    setBoard((prev) => ({ ...prev, entries, loading: false }));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchAreas is async; setBoard runs post-await
    fetchAreas();
  }, [fetchAreas]);

  useEffect(() => {
    if (selectedAreaId === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchEntries is async; setBoard runs post-await
    fetchEntries(selectedAreaId);
    const interval = setInterval(
      () => fetchEntries(selectedAreaId),
      POLL_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [selectedAreaId, fetchEntries]);

  const { queueEntries, areaEntries } = groupBoardEntries(board.entries);
  const displayedQueueEntries = filterQueueEntries(queueEntries, filter);
  const selectedArea = board.areas.find((a) => a.id === selectedAreaId) ?? null;

  function refetch() {
    if (selectedAreaId !== null) fetchEntries(selectedAreaId);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeEntry = displayedQueueEntries.find(
      (e) => String(e.id) === active.id,
    );
    if (!activeEntry || activeEntry.status !== "ON_YARD") return;

    const overEntry = displayedQueueEntries.find(
      (e) => String(e.id) === over.id,
    );
    if (!overEntry || overEntry.status !== "ON_YARD") return;

    const onYardList = displayedQueueEntries.filter(
      (e) => e.status === "ON_YARD",
    );
    const newIndex = onYardList.findIndex((e) => String(e.id) === over.id);
    if (newIndex === -1) return;

    try {
      await setOrder(activeEntry.id, newIndex + 1);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao reordenar");
    }
    refetch();
  }

  // --- Queue entry (left list) actions ---

  function handleConfirmSchedule(entry: IQueueEntry) {
    setQueueDialogEntry(null);
    router.push(
      `/dashboard/schedule/queue-entries/confirm?plate=${encodeURIComponent(entry.truck_plate)}`,
    );
  }

  async function handleStartOperation(entry: IQueueEntry) {
    setQueueDialogEntry(null);
    try {
      await startOperation(entry.id);
      toast("Operação iniciada");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao iniciar operação");
    }
    refetch();
  }

  function handleMovePosition(entry: IQueueEntry) {
    setQueueDialogEntry(null);
    setPositionEntry(entry);
  }

  async function handleFinish(entry: IQueueEntry) {
    setQueueDialogEntry(null);
    try {
      await finish(entry.id);
      toast("Agendamento finalizado");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao finalizar");
    }
    refetch();
  }

  // --- Area (right panel) actions ---

  async function handleEndOperation(entry: IQueueEntry) {
    setAreaDialogEntry(null);
    try {
      await awaitConclusion(entry.id);
      toast("Operação encerrada, aguardando NF");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao encerrar operação");
    }
    refetch();
  }

  // --- Shared actions ---

  function handleDetails(entry: IQueueEntry) {
    setQueueDialogEntry(null);
    setAreaDialogEntry(null);
    router.push(`/queue-entries/${entry.id}`);
  }

  function handleRequestCancel(entry: IQueueEntry) {
    setQueueDialogEntry(null);
    setAreaDialogEntry(null);
    setCancelTarget(entry);
  }

  async function handleConfirmCancel() {
    if (!cancelTarget) return;
    try {
      await cancel(cancelTarget.id);
      toast("Agendamento cancelado");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao cancelar");
    }
    setCancelTarget(null);
    refetch();
  }

  if (board.loading)
    return <p className="text-muted-foreground">Carregando fila...</p>;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="mx-auto flex max-w-170 flex-col gap-4">
        <AreaTabs
          areas={board.areas}
          selectedAreaId={selectedAreaId}
          onSelectAction={setSelectedAreaId}
        />

        {selectedArea && <AreaStatusBadge areaId={selectedArea.id} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[280px_1fr]">
          <div className="order-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1 sm:order-1">
            <div className="mb-2">
              <QueueFilterTabs value={filter} onChangeAction={setFilter} />
            </div>
            <QueueList
              entries={displayedQueueEntries}
              onSelectAction={setQueueDialogEntry}
            />
          </div>

          <div className="order-1 sm:order-2">
            {selectedArea && (
              <AreaOperationPanel
                area={selectedArea}
                entries={areaEntries}
                onSelectAction={setAreaDialogEntry}
              />
            )}
          </div>
        </div>
      </div>

      <QueueEntryActionDialog
        entry={queueDialogEntry}
        open={queueDialogEntry !== null}
        onOpenChangeAction={(open) => !open && setQueueDialogEntry(null)}
        onCancelAction={handleRequestCancel}
        onConfirmScheduleAction={handleConfirmSchedule}
        onStartOperationAction={handleStartOperation}
        onMovePositionAction={handleMovePosition}
        onFinishAction={handleFinish}
        onDetailsAction={handleDetails}
      />

      <AreaEntryActionDialog
        entry={areaDialogEntry}
        open={areaDialogEntry !== null}
        onOpenChangeAction={(open) => !open && setAreaDialogEntry(null)}
        onCancelAction={handleRequestCancel}
        onEndOperationAction={handleEndOperation}
        onDetailsAction={handleDetails}
      />

      <SetPositionDialog
        open={positionEntry !== null}
        onOpenChangeAction={(open) => !open && setPositionEntry(null)}
        maxPosition={
          displayedQueueEntries.filter((e) => e.status === "ON_YARD").length
        }
        onConfirmAction={async (position) => {
          if (!positionEntry) return;
          try {
            await setOrder(positionEntry.id, position);
            toast("Posição atualizada");
          } catch (err) {
            toast(err instanceof Error ? err.message : "Erro ao mover");
          }
          setPositionEntry(null);
          refetch();
        }}
      />

      <CancelConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        plate={cancelTarget?.truck_plate ?? ""}
        onConfirm={handleConfirmCancel}
      />
    </DndContext>
  );
}
