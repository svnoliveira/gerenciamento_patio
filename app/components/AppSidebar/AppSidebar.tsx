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
  ListCheck,
  ListEnd,
  ListCollapse,
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
    roles: ["ADMIN", "OPERATOR", "VIEWER", "COMPANY"],
  },
  {
    href: "/dashboard/live-queue",
    label: "Operação da fila",
    icon: Radio,
    roles: ["ADMIN", "OPERATOR", "VIEWER"],
  },
  {
    href: "/dashboard/trucks",
    label: "Caminhões",
    icon: Truck,
    roles: ["ADMIN", "OPERATOR", "VIEWER", "COMPANY"],
  },
  {
    href: "/dashboard/queue-entries",
    label: "Histórico de Agendamentos",
    icon: ListOrdered,
    roles: ["ADMIN", "OPERATOR", "VIEWER", "COMPANY"],
  },

  {
    href: "/dashboard/schedule",
    label: "Agendamentos",
    icon: ListCollapse,
    roles: ["ADMIN", "OPERATOR", "VIEWER", "COMPANY"],
  },
  {
    href: "/dashboard/schedule/queue-entries/new",
    label: "Novo Agendamento",
    icon: ListEnd,
    roles: ["ADMIN", "OPERATOR", "VIEWER"],
  },
  {
    href: "/dashboard/schedule/queue-entries/confirm",
    label: "Confirmar Agendamento",
    icon: ListCheck,
    roles: ["ADMIN", "OPERATOR", "VIEWER"],
  },
  {
    href: "/dashboard/companies",
    label: "Empresas",
    icon: Building2,
    roles: ["ADMIN", "OPERATOR", "VIEWER"],
  },
  {
    href: "/dashboard/users",
    label: "Usuários",
    icon: Users,
    roles: ["ADMIN", "OPERATOR", "VIEWER"],
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
          <Image src="/logo.png" alt="LRN Agrícola" width={28} height={28} />
          <span className="text-sm font-semibold">Grupo LRN</span>
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
              {visibleItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href + i}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
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
          {user?.name}
        </Badge>
        <Badge
          key={user?.id + (user?.email || "")}
          variant="secondary"
          className="mx-auto"
        >
          {user?.email}
        </Badge>
        <Button onClick={handleLogout}>Deslogar</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
