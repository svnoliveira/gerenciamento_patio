"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import {
  importExcel,
  syncExternalApi,
  ImportResult,
} from "@/app/actions/api/server/integrations";

export function IntegrationPanel() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      try {
        const res = await importExcel(file);
        setResult(res);
        toast(
          `Importação concluída: ${res.created_trucks + res.updated_trucks} caminhões processados`,
        );
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Erro ao importar planilha",
        );
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  function handleSync() {
    startTransition(async () => {
      try {
        const res = await syncExternalApi();
        setResult(res);
        toast(
          `Sincronização concluída: ${res.created_trucks + res.updated_trucks} caminhões processados`,
        );
      } catch (error) {
        toast(error instanceof Error ? error.message : "Erro ao sincronizar");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} /> Importar planilha
            </CardTitle>
            <CardDescription>
              Importa empresas e caminhões de um arquivo Excel (.xlsx).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handleFilePicked}
            />
            <Button
              className="w-full"
              disabled={isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {isPending ? "Importando..." : "Selecionar arquivo"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw size={20} /> Sincronizar API externa
            </CardTitle>
            <CardDescription>
              Busca dados atualizados da API financeira.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              variant="outline"
              disabled={isPending}
              onClick={handleSync}
            >
              {isPending ? "Sincronizando..." : "Sincronizar agora"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              Empresas criadas: <strong>{result.created_companies}</strong>
            </p>
            <p>
              Caminhões criados: <strong>{result.created_trucks}</strong>
            </p>
            <p>
              Caminhões atualizados: <strong>{result.updated_trucks}</strong>
            </p>
            <p>Total de linhas processadas: {result.total_rows}</p>

            {result.errors.length > 0 && (
              <div className="mt-3 space-y-1 rounded-md border border-destructive/30 bg-destructive/5 p-3">
                <p className="font-semibold text-destructive">
                  {result.errors.length} erro(s) encontrado(s):
                </p>
                <ul className="max-h-40 space-y-0.5 overflow-y-auto text-sm text-destructive">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
