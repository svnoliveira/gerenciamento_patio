import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";

import { QueueEntriesTable } from "@/app/components/QueueEntriesTable/QueueEntriesTable";
import { Pagination } from "@/app/components/Pagination/Pagination";
import { QueueFilterBar } from "@/app/components/QueueFilters/QueueFilterBar";
import { IPaginatedQueueEntries } from "@/app/interface/queue_entry/queue_entry";

const PARAM_KEYS = [
  "page",
  "plate",
  "driver",
  "company_name",
  "status",
  "job",
  "created_after",
  "created_before",
  "ordering",
];

export default async function QueueEntriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = sp.page ?? "1";

  const params = new URLSearchParams({ page, page_size: "16" });
  PARAM_KEYS.forEach((key) => {
    if (key !== "page" && key !== "page_size" && sp[key])
      params.set(key, sp[key]!);
  });

  const res = await serverApiFetch(`/queue-entries/?${params}`);
  const data: IPaginatedQueueEntries = await res.json();

  return (
    <div className="space-y-4 min-w-0">
      <h1 className="text-2xl font-semibold tracking-tight">
        Históricos de agendamento
      </h1>
      <QueueFilterBar />
      <QueueEntriesTable data={data} />
      <Pagination
        page={Number(page)}
        hasNext={!!data.next}
        hasPrevious={!!data.previous}
        count={data.count}
      />
    </div>
  );
}
