import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { AreasPageClient } from "@/app/components/AreasPageClient/AreasPageClient";
import { IPaginatedAreas } from "@/app/interface/area/area";

export default async function AreasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page = "1" } = await searchParams;

  const res = await serverApiFetch(`/areas/?page=${page}`);
  const data: IPaginatedAreas | null = await res.json();

  return (
    <div className="space-y-4">
      <AreasPageClient data={data} page={Number(page)} />
    </div>
  );
}
