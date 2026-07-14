import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { CompaniesPageClient } from "@/app/components/CompaniesPageClient/CompaniesPageClient";
import { IPaginatedCompanies } from "@/app/interface/company/company";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    name?: string;
  }>;
}) {
  const { page = "1", name = "" } = await searchParams;

  const params = new URLSearchParams({ page });
  if (name) params.set("name", name);
  const res = await serverApiFetch(`/companies/?${params}`);

  const data: IPaginatedCompanies | null = await res.json();

  return (
    <div className="space-y-4">
      <CompaniesPageClient data={data} page={Number(page)} />
    </div>
  );
}
