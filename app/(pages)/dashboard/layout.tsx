import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { AppSidebar } from "@/app/components/AppSidebar/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IUser } from "@/app/interface/user/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) redirect("/login");

  const meRes = await serverApiFetch("/me/");
  if (meRes.status === 401) redirect("/login");

  const user: IUser = await meRes.json();

  return (
    <SidebarProvider>
      <AppSidebar role={user.role} />

      <SidebarInset className="min-w-0">
        <header className="relative z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
        </header>
        <main
          className="relative min-w-0 overflow-hidden flex-1 bg-center bg-no-repeat bg-contain p-6"
          style={{
            backgroundImage: "url(/fadedlogo.png)",
            backgroundSize: "40%",
            opacity: 1,
          }}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
