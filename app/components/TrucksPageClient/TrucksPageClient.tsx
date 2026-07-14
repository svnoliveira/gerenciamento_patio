"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { TrucksTable } from "@/app/components/TrucksTable/TrucksTable";
import { TruckForm } from "@/app/components/TruckForm/TruckForm";
import { Pagination } from "@/app/components/Pagination/Pagination";
import { FilterBar, FilterConfig } from "@/app/components/FilterBar/FilterBar";
import { ITruck, IPaginatedTrucks } from "@/app/interface/truck/truck";
import { useUserStore } from "@/app/stores/useUserStore";

type PanelState =
  | { mode: "closed" }
  | { mode: "new" }
  | { mode: "edit"; truck: ITruck };

export function TrucksPageClient({
  data,
  page,
  companyOptions,
}: {
  data: IPaginatedTrucks | null;
  page: number;
  companyOptions: { value: string; label: string }[];
}) {
  const [panel, setPanel] = useState<PanelState>({ mode: "closed" });
  const user = useUserStore().user;
  const isUserAdmin = user?.role !== "COMPANY";

  const companyFilter: FilterConfig = {
    key: "company",
    label: "Empresa",
    type: "select",
    options: companyOptions,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Caminhões</h1>
        <Button onClick={() => setPanel({ mode: "new" })}>
          <Plus size={16} className="mr-1" /> Novo caminhão
        </Button>
      </div>

      <FilterBar
        filters={[
          {
            key: "plate",
            label: "Placa",
            type: "text",
            placeholder: "Buscar por placa...",
          },
          ...(isUserAdmin ? [companyFilter] : []),
        ]}
      />

      <div
        className={
          panel.mode === "closed" ? "" : "grid grid-cols-1 gap-4 xl:grid-cols-2"
        }
      >
        <div className="space-y-4">
          <TrucksTable
            data={data}
            selectedId={panel.mode === "edit" ? panel.truck.id : null}
            onSelect={(truck) => setPanel({ mode: "edit", truck })}
          />
          <Pagination
            page={page}
            hasNext={!!data?.next}
            hasPrevious={!!data?.previous}
            count={data?.count ?? 0}
          />
        </div>

        {panel.mode !== "closed" && (
          <TruckForm
            isUserAdmin={isUserAdmin}
            company_id={user?.company?.id}
            truck={panel.mode === "edit" ? panel.truck : null}
            companyOptions={companyOptions}
            onDone={() => setPanel({ mode: "closed" })}
          />
        )}
      </div>
    </div>
  );
}
