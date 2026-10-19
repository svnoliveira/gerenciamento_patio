import { fetchQueueEntryForEdit } from "@/app/actions/api/server/queue-entries-edit";
import { FinalNfEditForm } from "@/app/components/FinalNfEditForm/FinalNfEditForm";
import { QueueEntryEditForm } from "@/app/components/QueueEntryEditForm/QueueEntryEditForm";

export default async function EditQueueEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await fetchQueueEntryForEdit(Number(id));

  return (
    <div className="px-4 py-6">
      {entry.status === "FINISHED" ? (
        <FinalNfEditForm entry={entry} />
      ) : (
        <QueueEntryEditForm entry={entry} />
      )}
    </div>
  );
}
