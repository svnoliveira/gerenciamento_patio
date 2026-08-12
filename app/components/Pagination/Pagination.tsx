import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export function Pagination({
  page,
  hasNext,
  hasPrevious,
  count,
}: {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{count} registros</span>
      <div className="flex gap-2">
        {hasPrevious ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`?page=${page - 1}`}>Anterior</Link>}
          />
        ) : (
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
        )}
        {hasNext ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`?page=${page + 1}`}>Próxima</Link>}
          />
        ) : (
          <Button variant="outline" size="sm" disabled>
            Próxima
          </Button>
        )}
      </div>
    </div>
  );
}
