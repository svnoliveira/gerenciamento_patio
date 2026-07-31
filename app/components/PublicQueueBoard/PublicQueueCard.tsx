import Link from "next/link";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  IQueueEntryPublic,
  STATUS_LABELS,
} from "@/app/interface/queue_entry/queue_entry";
import { STATUS_COLORS } from "@/lib/statusColors";

export function PublicQueueCard({ entry }: { entry: IQueueEntryPublic }) {
  return (
    <Link href={`/queue-entries/${entry.id}`} className="block">
      <Card className="overflow-hidden py-0 gap-0 select-none transition-colors active:bg-muted">
        <div className={`h-1.5 w-full ${STATUS_COLORS[entry.status]}`} />
        <CardContent className="flex items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            {entry.queue_order !== null && (
              <Badge variant="secondary" className="px-3 py-1.5 text-lg">
                #{entry.queue_order}
              </Badge>
            )}
            <span className="text-2xl font-bold tracking-tight">
              {entry.truck_plate}
            </span>
          </div>

          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm ${STATUS_COLORS[entry.status]}`}
          >
            {STATUS_LABELS[entry.status] ?? entry.status}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
