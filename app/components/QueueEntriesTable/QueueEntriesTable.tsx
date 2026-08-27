import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import {
  IPaginatedQueueEntries,
  JOB_LABELS,
  STATUS_LABELS,
} from "@/app/interface/queue_entry/queue_entry";
import { formatDate } from "@/lib/formatDate";
import { formatDuration } from "@/lib/formatDuration";
import { STATUS_COLORS } from "@/lib/statusColors";
import Link from "next/link";
import { Camera, FileText, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DisabledEditButton } from "../DisabledEditButton/DisabledEditButton";

export function QueueEntriesTable({
  data,
}: {
  data: IPaginatedQueueEntries | null;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-md border h-167.5">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Motorista</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Tipo de carga</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Operação</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Chegada</TableHead>
            <TableHead>Início operação</TableHead>
            <TableHead>Aguardando NF</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Tempo até chegada</TableHead>
            <TableHead>Tempo em espera</TableHead>
            <TableHead>Tempo em operação</TableHead>
            <TableHead>Tempo aguardando NF</TableHead>
            <TableHead>Tempo total</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data?.results || data?.results.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={19}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data?.results.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/queue-entries/${entry.id}`}
                    className="hover:underline"
                    target="_blank"
                  >
                    {entry.truck_plate}
                  </Link>
                </TableCell>
                <TableCell>{entry.company_name ?? "—"}</TableCell>
                <TableCell>{entry.truck_driver}</TableCell>
                <TableCell>{entry.truck_product}</TableCell>
                <TableCell>{entry.truck_cargo_type}</TableCell>
                <TableCell>{entry.area?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={STATUS_COLORS[entry.status]}
                  >
                    {STATUS_LABELS[entry.status] ?? entry.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {entry.job ? (JOB_LABELS[entry.job] ?? entry.job) : "—"}
                </TableCell>
                <TableCell>
                  {entry.photo ? (
                    <Link
                      href={entry.photo}
                      target="_blank"
                      className="flex items-center justify-center"
                    >
                      <Camera className="h-4 w-4 text-primary" />
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {entry.document_photo ? (
                    <Link
                      href={entry.document_photo}
                      target="_blank"
                      className="flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{formatDate(entry.created_at)}</TableCell>
                <TableCell>{formatDate(entry.arrival_time)}</TableCell>
                <TableCell>{formatDate(entry.start_time)}</TableCell>
                <TableCell>
                  {formatDate(entry.awaiting_conclusion_time)}
                </TableCell>
                <TableCell>{formatDate(entry.end_time)}</TableCell>
                <TableCell>
                  {formatDuration(entry.created_at, entry.arrival_time)}
                </TableCell>
                <TableCell>
                  {formatDuration(entry.arrival_time, entry.start_time)}
                </TableCell>
                <TableCell>
                  {formatDuration(
                    entry.start_time,
                    entry.awaiting_conclusion_time,
                  )}
                </TableCell>
                <TableCell>
                  {formatDuration(
                    entry.awaiting_conclusion_time,
                    entry.end_time,
                  )}
                </TableCell>
                <TableCell>
                  {formatDuration(entry.created_at, entry.end_time)}
                </TableCell>
                <TableCell>
                  {entry.status !== "CANCELLED" &&
                  entry.status !== "FINISHED" ? (
                    <Link href={`/dashboard/queue-entries/${entry.id}/edit`}>
                      <Pencil
                        size={16}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      />
                    </Link>
                  ) : (
                    <DisabledEditButton />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
