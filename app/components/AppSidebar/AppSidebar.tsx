"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Truck,
  Users,
  Building2,
  MapPin,
  ListOrdered,
  Radio,
  Upload,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/app/components/ui/sidebar";
import { IUser } from "@/app/interface/user/user";
import { Button } from "../ui/button";
import { logoutRequest } from "@/app/actions/api/client/auth";
import { useUserStore } from "@/app/stores/useUserStore";
import { Badge } from "../ui/badge";

type Role = IUser["role"];

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof Truck;
  roles: Role[];
}[] = [
  {
    href: "/queue",
    label: "Agendamentos ao vivo",
    icon: Radio,
    roles: ["ADMIN", "OPERATOR", "COMPANY"],
  },
  {
    href: "/dashboard/live-queue",
    label: "Operação da fila",
    icon: Radio,
    roles: ["ADMIN", "OPERATOR"],
  },
  {
    href: "/dashboard/trucks",
    label: "Caminhões",
    icon: Truck,
    roles: ["ADMIN", "OPERATOR", "COMPANY"],
  },
  {
    href: "/dashboard/queue-entries",
    label: "Histórico de Agendamentos",
    icon: ListOrdered,
    roles: ["ADMIN", "OPERATOR", "COMPANY"],
  },
  {
    href: "/dashboard/companies",
    label: "Empresas",
    icon: Building2,
    roles: ["ADMIN", "OPERATOR"],
  },
  {
    href: "/dashboard/users",
    label: "Usuários",
    icon: Users,
    roles: ["ADMIN", "OPERATOR"],
  },
  { href: "/dashboard/areas", label: "Áreas", icon: MapPin, roles: ["ADMIN"] },
  {
    href: "/dashboard/integrations",
    label: "Integração",
    icon: Upload,
    roles: ["ADMIN"],
  },
];

export function AppSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const { push } = useRouter();
  const user = useUserStore().user;

  const handleLogout = async () => {
    await logoutRequest();
    push("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-2 py-3">
        <Link href="/" className="flex items-center gap-2 px-2">
          <Image src="/logo.png" alt="LNR Agrícola" width={28} height={28} />
          <span className="text-sm font-semibold">Grupo LNR</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/">
                      <Home />
                      <span>Início</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      render={
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Badge key={user?.id} variant="secondary" className="mx-auto">
          {user?.name} · {user?.email}
        </Badge>
        <Button onClick={handleLogout}>Deslogar</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
