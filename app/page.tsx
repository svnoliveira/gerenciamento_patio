import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "./components/ui/button";
import { Navbar } from "./components/NavBar/NavBar";
import { AuthGatedHomeButtons } from "./components/AuthGatedHomeButtons/AuthGatedHomeButtons";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-10 px-4 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo.png"
            alt="LRN Agrícola"
            width={196}
            height={196}
            priority
          />
          <h1 className="text-3xl font-bold tracking-tight">Grupo LRN</h1>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-4">
          <Suspense fallback={<div className="h-16" />}>
            <AuthGatedHomeButtons />
          </Suspense>
          <Button
            size="lg"
            variant="secondary"
            className="h-16 text-xl font-semibold"
            nativeButton={false}
            render={<Link href="/queue">VER AGENDAMENTOS AO VIVO</Link>}
          />
        </div>
      </main>
    </>
  );
}
