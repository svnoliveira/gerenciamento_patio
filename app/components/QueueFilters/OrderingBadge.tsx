"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { IOrderingOption } from "@/app/interface/queue_entry/queue_entry";

export function OrderingBadges({
  options,
  current,
  onChange,
}: {
  options: IOrderingOption[];
  current: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isAsc = current === opt.value;
        const isDesc = current === `-${opt.value}`;
        const isActive = isAsc || isDesc;

        function handleClick() {
          if (isAsc)
            onChange(`-${opt.value}`); // asc -> desc
          else if (isDesc)
            onChange(""); // desc -> none
          else onChange(opt.value); // none -> asc
        }

        return (
          <Badge
            key={opt.value}
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer select-none gap-1 py-1.5"
            onClick={handleClick}
          >
            {opt.label}
            {isAsc && <ArrowUp size={12} />}
            {isDesc && <ArrowDown size={12} />}
          </Badge>
        );
      })}
    </div>
  );
}
