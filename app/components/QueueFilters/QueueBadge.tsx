"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { TQueueFilterField } from "@/app/interface/queue_entry/queue_entry";

interface FilterBadgeProps {
  field: TQueueFilterField;
  value: string;
  valueAfter?: string;
  valueBefore?: string;
  onApply?: (value: string) => void;
  onApplyRange?: (after: string, before: string) => void;
  onClear: () => void;
}

export function FilterBadge({
  field,
  value,
  valueAfter,
  valueBefore,
  onApply,
  onApplyRange,
  onClear,
}: FilterBadgeProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(value);
  const [draftAfter, setDraftAfter] = useState(valueAfter ?? "");
  const [draftBefore, setDraftBefore] = useState(valueBefore ?? "");

  const isActive =
    field.type === "dateRange"
      ? Boolean(valueAfter || valueBefore)
      : Boolean(value);

  function displayLabel() {
    if (field.type === "select" && value) {
      return field.options.find((o) => o.value === value)?.label ?? value;
    }
    if (field.type === "dateRange") {
      if (valueAfter && valueBefore) return `${valueAfter} → ${valueBefore}`;
      if (valueAfter) return `Após ${valueAfter}`;
      if (valueBefore) return `Até ${valueBefore}`;
    }
    return value;
  }

  function handleConfirm() {
    if (field.type === "dateRange") {
      onApplyRange?.(draftAfter, draftBefore);
    } else {
      onApply?.(draft || "");
    }
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <Badge
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer select-none gap-1 py-1.5"
          >
            {field.label}
            {isActive && (
              <span className="font-normal">: {displayLabel()}</span>
            )}
            {isActive && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="ml-1 rounded-full hover:bg-black/10"
              >
                <X size={12} />
              </span>
            )}
          </Badge>
        }
      />
      <PopoverContent className="w-64 space-y-3">
        {field.type === "text" && (
          <Input
            autoFocus
            value={draft || ""}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={field.label}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
        )}

        {field.type === "select" && (
          <Select value={draft} onValueChange={setDraft}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.label}>
                {field.options.find((opt) => opt.value === draft)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === "dateRange" && (
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">De</label>
              <Input
                type="datetime-local"
                value={draftAfter}
                onChange={(e) => setDraftAfter(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Até</label>
              <Input
                type="datetime-local"
                value={draftBefore}
                onChange={(e) => setDraftBefore(e.target.value)}
              />
            </div>
          </div>
        )}

        <Button size="sm" className="w-full" onClick={handleConfirm}>
          Aplicar
        </Button>
      </PopoverContent>
    </Popover>
  );
}
