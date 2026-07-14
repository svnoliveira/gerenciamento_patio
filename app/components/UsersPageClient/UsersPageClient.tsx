"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { UsersTable } from "@/app/components/UsersTable/UsersTable";

import { Pagination } from "@/app/components/Pagination/Pagination";
import { FilterBar } from "@/app/components/FilterBar/FilterBar";
import { IUser, IPaginatedUsers } from "@/app/interface/user/user";
import { IPaginatedCompanies } from "@/app/interface/company/company";
import { UserForm } from "../UserForm/UserForm";
import Link from "next/link";

type PanelState =
  | { mode: "closed" }
  | { mode: "new" }
  | { mode: "edit"; user: IUser };

export function UsersPageClient({
  data,
  companiesData,
  page,
}: {
  data: IPaginatedUsers | null;
  companiesData: IPaginatedCompanies | null;
  page: number;
}) {
  const [panel, setPanel] = useState<PanelState>({ mode: "closed" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
        <Button
          nativeButton={false}
          render={
            <Link href="/register" target="_blank" rel="noopener noreferrer" />
          }
        >
          <Plus size={16} className="mr-1" />
          Novo usuário
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
          {
            key: "role",
            label: "Posição",
            type: "select",
            options: [
              { value: "ADMIN", label: "Administrador" },
              { value: "OPERATOR", label: "Operador" },
              { value: "COMPANY", label: "Empresa" },
            ],
          },
          {
            key: "company",
            label: "Empresa",
            type: "select",
            options: companiesData?.results.map(
              (c: { id: number; name: string }) => ({
                value: String(c.id),
                label: c.name,
              }),
            ),
          },
        ]}
      />

      <div
        className={
          panel.mode === "closed" ? "" : "grid grid-cols-1 gap-4 md:grid-cols-2"
        }
      >
        <div className="space-y-4">
          <UsersTable
            data={data}
            selectedId={panel.mode === "edit" ? panel.user.id : null}
            onSelect={(user) => setPanel({ mode: "edit", user })}
          />
          <Pagination
            page={page}
            hasNext={!!data?.next}
            hasPrevious={!!data?.previous}
            count={data?.count || 1}
          />
        </div>

        {panel.mode !== "closed" && (
          <UserForm
            user={panel.mode === "edit" ? panel.user : null}
            companies={companiesData?.results || []}
            onDone={() => setPanel({ mode: "closed" })}
          />
        )}
      </div>
    </div>
  );
}
