"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select";
  options?: FilterOption[];
  placeholder?: string;
}

export function FilterBar({ filters }: { filters: FilterConfig[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [textValues, setTextValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    filters.forEach((f) => {
      if (f.type === "text") initial[f.key] = searchParams.get(f.key) ?? "";
    });
    return initial;
  });

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params}`);
    });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      filters
        .filter((f) => f.type === "text")
        .forEach((f) => {
          const current = searchParams.get(f.key) ?? "";
          if (textValues[f.key] !== current) {
            updateParam(f.key, textValues[f.key]);
          }
        });
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textValues]);

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        if (filter.type === "text") {
          return (
            <Input
              key={filter.key}
              placeholder={filter.placeholder ?? filter.label}
              value={textValues[filter.key] ?? ""}
              onChange={(e) =>
                setTextValues((prev) => ({
                  ...prev,
                  [filter.key]: e.target.value,
                }))
              }
              className="max-w-xs"
            />
          );
        }

        const currentValue = searchParams.get(filter.key) ?? "";

        return (
          <Select
            key={filter.key}
            value={currentValue}
            onValueChange={(value) =>
              updateParam(filter.key, value === "all" ? "" : (value ?? ""))
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={filter.label}>
                {currentValue === "all" || !currentValue
                  ? undefined
                  : filter.options?.find((opt) => opt.value === currentValue)
                      ?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {filter.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
    </div>
  );
}
