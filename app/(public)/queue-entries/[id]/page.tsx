import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { QueueEntryDetailCard } from "@/app/components/QueueEntryDetailCard/QueueEntryDetailCard";
import { notFound } from "next/navigation";

export default async function QueueEntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await serverApiFetch(`/queue-entries/detail/${id}/`);

  if (res.status === 404) notFound();
  if (!res.ok) {
    console.error("queue-entries fetch failed:", res.status, await res.text());
    throw new Error("Falha ao carregar registro");
  }

  const entry = await res.json();

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <QueueEntryDetailCard entry={entry} />
    </main>
  );
}
