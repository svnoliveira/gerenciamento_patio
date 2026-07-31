import { PublicQueueBoard } from "@/app/components/PublicQueueBoard/PublicQueueBoard";

export default function LiveQueuePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-57px)] w-full flex-col gap-4 px-4 py-6">
      <h1 className="text-3xl font-bold tracking-tight text-center">
        Fila ao vivo
      </h1>
      <PublicQueueBoard />
    </main>
  );
}
