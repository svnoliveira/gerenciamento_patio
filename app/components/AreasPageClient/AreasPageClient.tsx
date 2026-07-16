"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { AreasTable } from "@/app/components/AreasTable/AreasTable";
import { AreaForm } from "@/app/components/AreaForm/AreaForm";
import { Pagination } from "@/app/components/Pagination/Pagination";
import { FilterBar } from "@/app/components/FilterBar/FilterBar";
import { IArea, IPaginatedAreas } from "@/app/interface/area/area";

type PanelState =
  | { mode: "closed" }
  | { mode: "new" }
  | { mode: "edit"; area: IArea };

export function AreasPageClient({
  data,
  page,
}: {
  data: IPaginatedAreas | null;
  page: number;
}) {
  const [panel, setPanel] = useState<PanelState>({ mode: "closed" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Áreas</h1>
        <Button onClick={() => setPanel({ mode: "new" })}>
          <Plus size={16} className="mr-1" /> Nova área
        </Button>
      </div>

      <div
        className={
          panel.mode === "closed" ? "" : "grid grid-cols-1 gap-4 md:grid-cols-2"
        }
      >
        <div className="space-y-4">
          <AreasTable
            data={data}
            selectedId={panel.mode === "edit" ? panel.area.id : null}
            onSelect={(area) => setPanel({ mode: "edit", area })}
          />
          <Pagination
            page={page}
            hasNext={!!data?.next}
            hasPrevious={!!data?.previous}
            count={data?.count || 1}
          />
        </div>

        {panel.mode !== "closed" && (
          <AreaForm
            area={panel.mode === "edit" ? panel.area : null}
            onDoneAction={() => setPanel({ mode: "closed" })}
          />
        )}
      </div>
    </div>
  );
}
