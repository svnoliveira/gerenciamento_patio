"use client";

import { useState } from "react";
import { CalendarIcon, Check, X } from "lucide-react";
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
import { formatDateForBadge } from "@/lib/formatDate";
import { DateRange } from "react-day-picker";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(value);
  const [draftAfter, setDraftAfter] = useState(valueAfter ?? "");
  const [draftBefore, setDraftBefore] = useState(valueBefore ?? "");

  const range: DateRange | undefined = {
    from: draftAfter ? new Date(draftAfter) : undefined,
    to: draftBefore ? new Date(draftBefore) : undefined,
  };

  const isActive =
    field.type === "dateRange"
      ? Boolean(valueAfter || valueBefore)
      : Boolean(value);

  function displayLabel() {
    if (field.type === "select" && value) {
      return field.options.find((o) => o.value === value)?.label ?? value;
    }
    if (field.type === "dateRange") {
      const after = valueAfter ? formatDateForBadge(valueAfter) : "";
      const before = valueBefore ? formatDateForBadge(valueBefore) : "";
      if (after && before) return `${after} → ${before}`;
      if (after) return `Após ${after}`;
      if (before) return `Até ${before}`;
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
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              nativeButton
              render={
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {range?.from ? (
                    range.to ? (
                      <>
                        {format(range.from, "dd/MM/yyyy")} -{" "}
                        {format(range.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(range.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <div className="overflow-hidden rounded-lg border bg-popover shadow-lg">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(newRange) => {
                    setDraftAfter(newRange?.from?.toISOString() ?? "");
                    setDraftBefore(newRange?.to?.toISOString() ?? "");
                  }}
                  className="p-3"
                />
                <div className="flex items-center justify-end gap-2 border-t bg-muted/50 p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs text-destructive hover:text-destructive"
                    onClick={() => {
                      setDraftAfter("");
                      setDraftBefore("");
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                    Limpar
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={() => setCalendarOpen(false)}
                  >
                    <Check className="h-3.5 w-3.5" />
                    OK
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <Button size="sm" className="w-full" onClick={handleConfirm}>
          Aplicar
        </Button>
      </PopoverContent>
    </Popover>
  );
}
