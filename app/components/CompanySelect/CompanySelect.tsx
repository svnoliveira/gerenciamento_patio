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
import { ICompany } from "@/app/interface/company/company";

export function CompanySelect({
  value,
  onChangeAction,
}: {
  value: string;
  onChangeAction: (name: string) => void;
}) {
  const [companies, setCompanies] = useState<ICompany[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchCompanies() {
      const res = await clientApiFetch("/companies/?page_size=300");
      if (res.ok && !cancelled) {
        const data = await res.json();
        setCompanies(data.results);
      }
    }

    fetchCompanies();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Select value={value} onValueChange={(v) => onChangeAction(String(v))}>
      <SelectTrigger className="h-14 w-full text-lg">
        <SelectValue placeholder="Selecione a empresa (opcional)">
          {value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {companies.map((c) => (
          <SelectItem key={c.id} value={c.name}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
