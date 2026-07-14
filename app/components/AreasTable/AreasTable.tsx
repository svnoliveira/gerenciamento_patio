"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { IArea, IPaginatedAreas } from "@/app/interface/area/area";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

export function AreasTable({
  data,
  selectedId,
  onSelect,
}: {
  data: IPaginatedAreas | null;
  selectedId: number | null;
  onSelect: (area: IArea) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Capacidade</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhuma área encontrada.
              </TableCell>
            </TableRow>
          ) : (
            data?.results.map((area) => (
              <TableRow
                key={area.id}
                className={cn(
                  "cursor-pointer",
                  selectedId === area.id && "bg-muted",
                )}
                onClick={() => onSelect(area)}
              >
                <TableCell>{area.name}</TableCell>
                <TableCell>{area.capacity}</TableCell>
                <TableCell>{formatDate(area.created_at)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
