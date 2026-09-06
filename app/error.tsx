"use client";

import { Button } from "@/app/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">
        Ocorreu um erro inesperado na aplicação
      </h1>
      <p className="text-muted-foreground">
        Tente novamente. Se o problema persistir, entre em contato com o
        suporte.
      </p>
      <p className="text-xs text-muted-foreground/60">Código: {error.digest}</p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
