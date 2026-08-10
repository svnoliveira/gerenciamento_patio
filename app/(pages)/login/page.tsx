import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { LoginForm } from "@/app/components/LoginForm/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (accessToken) {
    const meRes = await serverApiFetch("/me/");
    if (meRes.ok) {
      redirect("/dashboard");
    }
    redirect("/api/logout");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <LoginForm />
    </div>
  );
}
