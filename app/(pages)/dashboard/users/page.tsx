import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { IPaginatedUsers } from "@/app/interface/user/user";
import { UsersPageClient } from "@/app/components/UsersPageClient/UsersPageClient";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    name?: string;
    role?: string;
    company?: string;
  }>;
}) {
  const { page = "1", name = "", role = "", company = "" } = await searchParams;

  const params = new URLSearchParams({ page });
  if (name) params.set("name", name);
  if (role) params.set("role", role);
  if (company) params.set("company", company);

  const [usersRes, companiesRes] = await Promise.all([
    serverApiFetch(`/users/?${params}`),
    serverApiFetch(`/companies/?page_size=300`),
  ]);

  const data: IPaginatedUsers = await usersRes.json();
  const companiesData = await companiesRes.json();

  return (
    <div className="space-y-4">
      <UsersPageClient
        companiesData={companiesData}
        data={data}
        page={Number(page)}
      />
    </div>
  );
}
