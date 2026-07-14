import { OperatorQueueBoard } from "@/app/components/OperatorQueueBoard/OperatorQueueBoard";

export default function LiveQueueBoardPage() {
  return (
    <div className="space-y-4">
      <div className="max-w-170 mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">
          Fila ao vivo — Operação
        </h1>
      </div>
      <OperatorQueueBoard />
    </div>
  );
}
