"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/hooks/auth";
import { Button } from "@/app/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Grupo LNR" width={36} height={36} />
        <span className="text-lg font-bold">LNR</span>
      </Link>

      <nav className="flex items-center gap-2">
        <Button
          nativeButton={false}
          variant="ghost"
          render={<Link href="/queue">Agendamentos ao vivo</Link>}
        />
        {user ? (
          <>
            <Button
              nativeButton={false}
              variant="ghost"
              render={<Link href="/dashboard">Painel</Link>}
            />
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/login">Entrar</Link>}
            />
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/register">Cadastrar</Link>}
            />
          </>
        )}
      </nav>
    </header>
  );
}
