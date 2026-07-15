import { OperatorQueueBoard } from "@/app/components/OperatorQueueBoard/OperatorQueueBoard";
import { QueueStatusBadge } from "@/app/components/QueueStatusBadge/QueueStatusBadge";

export default function LiveQueueBoardPage() {
  return (
    <div className="space-y-4">
      <div className="max-w-170 mx-auto flex justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Fila ao vivo — Operação
        </h1>
        <QueueStatusBadge />
      </div>
      <OperatorQueueBoard />
    </div>
  );
}
