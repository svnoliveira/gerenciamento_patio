"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { ICompany, IPaginatedCompanies } from "@/app/interface/company/company";

export function CompaniesTable({
  data,
  selectedId,
  onSelect,
}: {
  data: IPaginatedCompanies | null;
  selectedId: number | null;
  onSelect: (company: ICompany) => void;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="rounded-md border h-167.5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Nome</TableHead>
            <TableHead>Usuários</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhuma empresa encontrada.
              </TableCell>
            </TableRow>
          ) : (
            data?.results.map((company) => {
              const isExpanded = expandedId === company.id;
              return (
                <Fragment key={company.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : company.id)
                    }
                    onDoubleClick={() => onSelect(company)}
                  >
                    <TableCell>
                      {isExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {company.name}
                    </TableCell>
                    <TableCell>{company.users.length}</TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={3} className="bg-muted/30">
                        {company.users.length === 0 ? (
                          <span className="text-sm text-muted-foreground">
                            Nenhum usuário vinculado.
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2 py-1">
                            {company.users.map((user) => (
                              <Badge key={user.id} variant="secondary">
                                {user.name} · {user.email}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
