"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { IArea } from "@/app/interface/area/area";

export function AreaSelect({
  value,
  onChangeAction,
  className,
}: {
  value: number | undefined;
  onChangeAction: (areaId: number) => void;
  className?: string;
}) {
  const [areas, setAreas] = useState<IArea[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAreas() {
      const res = await clientApiFetch("/areas/?page_size=100");
      if (res.ok && !cancelled) {
        const data = await res.json();
        setAreas(data.results);
      }
    }

    fetchAreas();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Select
      value={value ? String(value) : ""}
      onValueChange={(v) => onChangeAction(Number(v))}
    >
      <SelectTrigger className={className ?? "h-14 w-full text-lg"}>
        <SelectValue placeholder="Selecione a área">
          {areas.find((a) => a.id === value)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {areas.map((area) => (
          <SelectItem key={area.id} value={String(area.id)}>
            {area.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
