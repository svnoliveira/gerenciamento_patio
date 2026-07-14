import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { IPaginatedTrucks } from "@/app/interface/truck/truck";
import { TrucksPageClient } from "@/app/components/TrucksPageClient/TrucksPageClient";

export default async function TrucksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; plate?: string; company?: string }>;
}) {
  const { page = "1", plate = "", company = "" } = await searchParams;

  const params = new URLSearchParams({ page });
  if (plate) params.set("plate", plate);
  if (company) params.set("company", company);

  const [trucksRes, companiesRes] = await Promise.all([
    serverApiFetch(`/trucks/?${params}`),
    serverApiFetch(`/companies/?page_size=100`),
  ]);

  const data: IPaginatedTrucks = await trucksRes.json();
  const companiesData = await companiesRes.json();

  const companyOptions = companiesData.results.map(
    (c: { id: number; name: string }) => ({
      value: String(c.id),
      label: c.name,
    }),
  );

  return (
    <TrucksPageClient
      data={data}
      page={Number(page)}
      companyOptions={companyOptions}
    />
  );
}
