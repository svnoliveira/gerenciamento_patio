"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import {
  moveToArea,
  cancel,
  finish,
  standby,
  setOrder,
  moveToWaiting,
} from "@/app/actions/api/server/queue-entries";
import { groupQueueEntries } from "@/lib/groupQueueEntries";
import { WaitingColumn } from "./WaitingColumn";
import { AreaColumn } from "./AreaColumn";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { IArea } from "@/app/interface/area/area";

const ACTIVE_STATUSES = "WAITING,STANDBY,INSIDE";
const POLL_INTERVAL_MS = 5000;

interface BoardState {
  entries: IQueueEntry[];
  areas: IArea[];
  loading: boolean;
}

export function OperatorQueueBoard() {
  const [board, setBoard] = useState<BoardState>({
    entries: [],
    areas: [],
    loading: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const fetchBoard = useCallback(async () => {
    const [entriesRes, areasRes] = await Promise.all([
      clientApiFetch(
        `/queue-entries/?status_in=${ACTIVE_STATUSES}&ordering=queue_order&page_size=100`,
      ),
      clientApiFetch(`/areas/?page_size=100`),
    ]);

    const entries = entriesRes.ok ? (await entriesRes.json()).results : [];
    const areas = areasRes.ok ? (await areasRes.json()).results : [];

    setBoard({ entries, areas, loading: false });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchBoard is async; setBoard runs after the awaited fetches resolve, not synchronously in the effect
    fetchBoard();
    const interval = setInterval(fetchBoard, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchBoard]);

  const { waiting, byArea } = groupQueueEntries(board.entries);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const entryId = Number(active.id);
    const overId = String(over.id);

    // Dropped onto an area zone
    if (overId.startsWith("area-")) {
      const areaId = Number(overId.replace("area-", ""));
      try {
        await moveToArea(entryId, areaId);
        toast("Caminhão movido para a área");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Erro ao mover caminhão");
      }
      fetchBoard();
      return;
    }

    // Dropped within the waiting list (over another card) -> reorder
    const oldIndex = waiting.findIndex((e) => String(e.id) === active.id);
    const newIndex = waiting.findIndex((e) => String(e.id) === overId);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    // optimistic reorder
    const reordered = arrayMove(waiting, oldIndex, newIndex);
    setBoard((prev) => ({
      ...prev,
      entries: [
        ...reordered,
        ...prev.entries.filter((e) => !waiting.some((w) => w.id === e.id)),
      ],
    }));

    try {
      await setOrder(entryId, newIndex + 1);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao reordenar");
    }
    fetchBoard();
  }

  async function handleAction(
    id: number,
    action: "finish" | "cancel" | "standby",
  ) {
    try {
      if (action === "finish") await finish(id);
      if (action === "cancel") await cancel(id);
      if (action === "standby") await standby(id);
      toast("Atualizado com sucesso");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao atualizar");
    }
    fetchBoard();
  }

  async function handleMoveToWaiting(id: number, position: number) {
    try {
      await moveToWaiting(id, position);
      toast("Caminhão movido para aguardando");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao mover caminhão");
    }
    fetchBoard();
  }

  if (board.loading)
    return <p className="text-muted-foreground">Carregando fila...</p>;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[280px_1fr] max-w-170 mx-auto">
        <div className="order-2 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 sm:order-1">
          <WaitingColumn
            entries={waiting}
            onCancel={(id) => handleAction(id, "cancel")}
          />
        </div>

        <div className="order-1 flex flex-col gap-4 sm:order-2">
          {board.areas.map((area) => (
            <AreaColumn
              key={area.id}
              area={area}
              entries={byArea.get(area.id) ?? []}
              waitingCount={waiting.length}
              onAction={handleAction}
              onMoveToWaiting={handleMoveToWaiting}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
