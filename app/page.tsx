import Image from "next/image";
import { Button } from "./components/ui/button";
import Link from "next/link";
import { Navbar } from "./components/NavBar/NavBar";

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
          <Button
            size="lg"
            className="h-16 text-xl font-semibold"
            nativeButton={false}
            render={<Link href="/queue-entries/new">REALIZAR AGENDAMENTO</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            className="h-16 text-xl font-semibold"
            nativeButton={false}
            render={
              <Link href="/queue-entries/confirm">CONFIRMAR AGENDAMENTO</Link>
            }
          />
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
