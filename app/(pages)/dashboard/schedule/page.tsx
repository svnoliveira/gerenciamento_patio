import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { IPaginatedResponse } from "@/app/interface/admin/global";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { IUser } from "@/app/interface/user/user";
import { SchedulePageClient } from "@/app/components/SchedulePageClient/SchedulePageClient";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page = "1" } = await searchParams;

  const [entriesRes, meRes] = await Promise.all([
    serverApiFetch(`/queue-entries/?status=SCHEDULED&page=${page}`),
    serverApiFetch("/me/"),
  ]);

  const data: IPaginatedResponse<IQueueEntry> = await entriesRes.json();
  const currentUser: IUser = await meRes.json();

  return (
    <SchedulePageClient
      data={data}
      page={Number(page)}
      currentUser={currentUser}
    />
  );
}
