"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { clientApiFetch } from "@/app/actions/api/client/clientApiFetch";
import { getFriendlyErrorMessage } from "@/lib/getFriendlyErrorMessage";

function buildFilename() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `historico-agendamentos-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.xlsx`;
}

export function ExportQueueEntriesButton() {
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const lock = useRef(false);

  async function handleExport() {
    if (lock.current) return;
    lock.current = true;
    setIsExporting(true);

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      params.delete("page_size");

      const res = await clientApiFetch(
        `/queue-entries/export/?${params.toString()}`,
      );
      if (!res.ok) {
        toast(
          getFriendlyErrorMessage(
            res.status,
            "Não foi possível gerar a planilha.",
          ),
        );
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = buildFilename();
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast("Erro de conexão ao gerar a planilha.");
    } finally {
      lock.current = false;
      setIsExporting(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      {isExporting ? (
        <Loader2 size={16} className="mr-2 animate-spin" />
      ) : (
        <Download size={16} className="mr-2" />
      )}
      {isExporting ? "Gerando..." : "Exportar Excel"}
    </Button>
  );
}
