"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { CompaniesTable } from "@/app/components/CompaniesTable/CompaniesTable";
import { Pagination } from "@/app/components/Pagination/Pagination";
import { FilterBar } from "@/app/components/FilterBar/FilterBar";
import { ICompany, IPaginatedCompanies } from "@/app/interface/company/company";
import { CompanyForm } from "../CompanyForm/CompanyForm";

type PanelState =
  | { mode: "closed" }
  | { mode: "new" }
  | { mode: "edit"; company: ICompany };

export function CompaniesPageClient({
  data,
  page,
}: {
  data: IPaginatedCompanies | null;
  page: number;
}) {
  const [panel, setPanel] = useState<PanelState>({ mode: "closed" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Empresas</h1>
        <Button onClick={() => setPanel({ mode: "new" })}>
          <Plus size={16} className="mr-1" /> Nova Empresa
        </Button>
      </div>

      <FilterBar
        filters={[
          {
            key: "name",
            label: "Nome",
            type: "text",
            placeholder: "Buscar por nome...",
          },
        ]}
      />

      <div
        className={
          panel.mode === "closed" ? "" : "grid grid-cols-1 gap-4 md:grid-cols-2"
        }
      >
        <div className="space-y-4">
          <CompaniesTable
            data={data}
            selectedId={panel.mode === "edit" ? panel.company.id : null}
            onSelect={(company) => setPanel({ mode: "edit", company })}
          />
          <Pagination
            page={page}
            hasNext={!!data?.next}
            hasPrevious={!!data?.previous}
            count={data?.count || 1}
          />
        </div>

        {panel.mode !== "closed" && (
          <CompanyForm
            company={panel.mode === "edit" ? panel.company : null}
            onDoneAction={() => setPanel({ mode: "closed" })}
          />
        )}
      </div>
    </div>
  );
}
