"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { IPaginatedResponse } from "@/app/interface/admin/global";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

export function ScheduleEntriesTable({
  data,
  selectedId,
  onSelectAction,
}: {
  data: IPaginatedResponse<IQueueEntry> | null;
  selectedId: number | null;
  onSelectAction: (entry: IQueueEntry) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Motorista</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.results.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum agendamento encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data.results.map((entry) => (
              <TableRow
                key={entry.id}
                className={cn(
                  "cursor-pointer",
                  selectedId === entry.id && "bg-muted",
                )}
                onClick={() => onSelectAction(entry)}
              >
                <TableCell className="font-medium">
                  {entry.truck_plate}
                </TableCell>
                <TableCell>{entry.company_name ?? "—"}</TableCell>
                <TableCell>{entry.truck_driver}</TableCell>
                <TableCell>{entry.area?.name ?? "Não definida"}</TableCell>
                <TableCell>{formatDate(entry.created_at)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
