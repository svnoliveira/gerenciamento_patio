import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { IUser } from "@/app/interface/user/user";
import { ITruck } from "@/app/interface/truck/truck";
import { ICompany } from "@/app/interface/company/company";
import { IArea } from "@/app/interface/area/area";
import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";
import { IPaginatedResponse } from "@/app/interface/admin/global";

async function getList<T>(path: string): Promise<IPaginatedResponse<T>> {
  const res = await serverApiFetch(path);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return res.json();
}

export const DashboardAdmin = async () => {
  const [users, trucks, companies, areas, queueEntries] = await Promise.all([
    getList<IUser>("/users/?page=1"),
    getList<ITruck>("/trucks/?page=1"),
    getList<ICompany>("/companies/?page=1"),
    getList<IArea>("/areas/?page=1"),
    getList<IQueueEntry>("/queue-entries/?page=1"),
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {/* <UsersSummaryCard data={users} />
      <TrucksSummaryCard data={trucks} />
      <CompaniesSummaryCard data={companies} />
      <AreasSummaryCard data={areas} />
      <QueueSummaryCard data={queueEntries} /> */}
    </div>
  );
};
