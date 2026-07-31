"use client";

import { Button } from "@/app/components/ui/button";
import { IArea } from "@/app/interface/area/area";

export function AreaTabs({
  areas,
  selectedAreaId,
  onSelectAction,
}: {
  areas: IArea[];
  selectedAreaId: number | null;
  onSelectAction: (areaId: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_2fr] gap-1 overflow-x-auto pb-1">
      {areas.map((area) => (
        <Button
          key={area.id}
          variant={selectedAreaId === area.id ? "default" : "outline"}
          className="h-12 shrink-0 text-base"
          onClick={() => onSelectAction(area.id)}
        >
          {area.name}
        </Button>
      ))}
    </div>
  );
}
