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

export function QueueEntriesTable({
  data,
}: {
  data: IPaginatedQueueEntries | null;
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Motorista</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Granel</TableHead>
            <TableHead>Bag</TableHead>
            <TableHead>Pallet</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Operação</TableHead>
            {/* <TableHead>Em espera</TableHead> */}
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Tempo em trânsito</TableHead>
            <TableHead>Tempo em espera</TableHead>
            <TableHead>Tempo total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={16}
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
                <TableCell>{entry.area?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={STATUS_COLORS[entry.status]}
                  >
                    {STATUS_LABELS[entry.status] ?? entry.status}
                  </Badge>
                </TableCell>
                <TableCell>{JOB_LABELS[entry.job] ?? entry.job}</TableCell>
                {/* <TableCell>{formatDate(entry.on_standby_time)}</TableCell> */}
                <TableCell>{formatDate(entry.start_time)}</TableCell>
                <TableCell>{formatDate(entry.end_time)}</TableCell>
                <TableCell>
                  {formatDuration(entry.start_time, entry.end_time)}
                </TableCell>
                <TableCell>
                  {formatDuration(entry.created_at, entry.start_time)}
                </TableCell>
                <TableCell>
                  {formatDuration(entry.created_at, entry.end_time)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
