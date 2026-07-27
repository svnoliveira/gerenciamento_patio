"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { ITruck, IPaginatedTrucks } from "@/app/interface/truck/truck";
import { cn } from "@/lib/utils";

export function TrucksTable({
  data,
  selectedId,
  onSelect,
}: {
  data: IPaginatedTrucks | null;
  selectedId: string | null;
  onSelect: (truck: ITruck) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Motorista</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.results.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum caminhão encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data.results.map((truck) => (
              <TableRow
                key={truck.id}
                className={cn(
                  "cursor-pointer",
                  selectedId === truck.id && "bg-muted",
                )}
                onClick={() => onSelect(truck)}
              >
                <TableCell className="font-medium">{truck.plate}</TableCell>
                <TableCell>{truck.driver}</TableCell>
                <TableCell>{truck.cpf}</TableCell>
                <TableCell>{truck.cellphone}</TableCell>
                <TableCell>{truck.company?.name ?? "—"}</TableCell>
                <TableCell>{truck.product}</TableCell>
                <TableCell>{truck.type}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
