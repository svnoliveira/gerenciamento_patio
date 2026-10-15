import { AwaitingNFBoard } from "@/app/components/AwaitingNFBoard/AwaitingNFBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aguardando NF",
};

export default function AwaitingNFPage() {
  return <AwaitingNFBoard />;
}
