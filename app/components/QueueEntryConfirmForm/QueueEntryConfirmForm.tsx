"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { formatPlate } from "@/lib/formatNumbers";
import { findScheduledEntriesByPlate } from "@/app/actions/api/client/findScheduledEntriesByPlate";
import { ScheduledEntryPickCard } from "../ScheduledEntryPickCard/ScheduledEntryPickCard";
import { QueueEntryConfirmCompleteForm } from "./QueueEntryConfirmCompleteForm";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";

type TStage =
  | { step: "lookup" }
  | { step: "pick"; entries: IQueueEntry[] }
  | { step: "complete"; entry: IQueueEntry };

export function QueueEntryConfirmForm() {
  const searchParams = useSearchParams();
  const initialPlate = searchParams.get("plate") ?? "";

  const [stage, setStage] = useState<TStage>({ step: "lookup" });
  const [plateInput, setPlateInput] = useState(initialPlate);
  const [isSearching, setIsSearching] = useState(false);

  async function runLookup(plate: string) {
    setIsSearching(true);
    try {
      const entries = await findScheduledEntriesByPlate(plate);
      if (entries.length === 0) {
        toast("Nenhum agendamento encontrado para esta placa.");
        return;
      }
      if (entries.length === 1) {
        setStage({ step: "complete", entry: entries[0] });
      } else {
        setStage({ step: "pick", entries });
      }
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Erro ao buscar agendamento",
      );
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    const load = async () => {
      if (initialPlate && initialPlate.length === 7) {
        await runLookup(initialPlate);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only auto-run once on mount, using whatever plate was in the URL at that time
  }, []);

  if (stage.step === "lookup") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <h1 className="text-3xl font-bold tracking-tight">
          Confirmar agendamento
        </h1>

        <div className="space-y-1.5">
          <Label className="text-base">Placa</Label>
          <Input
            className="h-14 text-lg"
            placeholder="ABC1D23"
            value={plateInput}
            onChange={(e) => setPlateInput(formatPlate(e.target.value))}
            maxLength={7}
          />
        </div>

        <Button
          size="lg"
          className="h-16 text-xl font-semibold"
          disabled={isSearching || plateInput.length < 7}
          onClick={() => runLookup(plateInput)}
        >
          {isSearching ? "Buscando..." : "Buscar Placa"}
        </Button>
      </div>
    );
  }

  if (stage.step === "pick") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Selecione o agendamento
        </h1>
        <p className="text-muted-foreground">
          Encontramos {stage.entries.length} agendamentos para a placa{" "}
          {plateInput}.
        </p>
        {stage.entries.map((entry) => (
          <ScheduledEntryPickCard
            key={entry.id}
            entry={entry}
            onSelectAction={() => setStage({ step: "complete", entry })}
          />
        ))}
        <Button variant="outline" onClick={() => setStage({ step: "lookup" })}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <QueueEntryConfirmCompleteForm
      entry={stage.entry}
      onBackAction={() => setStage({ step: "lookup" })}
    />
  );
}
