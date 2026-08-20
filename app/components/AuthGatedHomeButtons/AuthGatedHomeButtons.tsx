import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { cookies } from "next/headers";
import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";

export async function AuthGatedHomeButtons() {
  const cookieStore = await cookies();
  const hasToken = !!cookieStore.get("access_token");

  let isLoggedIn = false;
  if (hasToken) {
    const meRes = await serverApiFetch("/me/");
    isLoggedIn = meRes.ok;
  }

  if (!isLoggedIn) return null;

  return (
    <>
      <Button
        size="lg"
        className="h-16 text-xl font-semibold"
        nativeButton={false}
        render={
          <Link href="/dashboard/schedule/queue-entries/new">
            REALIZAR AGENDAMENTO
          </Link>
        }
      />
      <Button
        size="lg"
        variant="outline"
        className="h-16 text-xl font-semibold"
        nativeButton={false}
        render={
          <Link href="/dashboard/schedule/queue-entries/confirm">
            CONFIRMAR AGENDAMENTO
          </Link>
        }
      />
    </>
  );
}
