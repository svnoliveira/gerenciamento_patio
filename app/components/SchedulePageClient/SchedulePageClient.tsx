"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScheduleEntriesTable } from "../ScheduleEntriesTable/ScheduleEntriesTable";
import { ScheduleEntryForm } from "../ScheduleEntryForm/ScheduleEntryForm";
import { Pagination } from "../Pagination/Pagination";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { IPaginatedResponse } from "@/app/interface/admin/global";
import { IUser } from "@/app/interface/user/user";

type PanelState =
  | { mode: "closed" }
  | { mode: "new" }
  | { mode: "edit"; entry: IQueueEntry };

export function SchedulePageClient({
  data,
  page,
  currentUser,
}: {
  data: IPaginatedResponse<IQueueEntry> | null;
  page: number;
  currentUser: IUser;
}) {
  const [panel, setPanel] = useState<PanelState>({ mode: "closed" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agendamentos</h1>
        <Button onClick={() => setPanel({ mode: "new" })}>
          <Plus size={16} className="mr-1" /> Novo agendamento
        </Button>
      </div>

      <div
        className={
          panel.mode === "closed" ? "" : "grid grid-cols-1 gap-4 xl:grid-cols-2"
        }
      >
        <div className="space-y-4">
          <ScheduleEntriesTable
            data={data}
            selectedId={panel.mode === "edit" ? panel.entry.id : null}
            onSelectAction={(entry) => setPanel({ mode: "edit", entry })}
          />
          <Pagination
            page={page}
            hasNext={!!data?.next}
            hasPrevious={!!data?.previous}
            count={data?.count ?? 0}
          />
        </div>

        {panel.mode !== "closed" && (
          <ScheduleEntryForm
            entry={panel.mode === "edit" ? panel.entry : null}
            currentUser={currentUser}
            onDoneAction={() => setPanel({ mode: "closed" })}
          />
        )}
      </div>
    </div>
  );
}
