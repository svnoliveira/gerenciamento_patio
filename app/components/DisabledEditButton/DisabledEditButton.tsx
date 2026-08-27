"use client";

import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function DisabledEditButton() {
  return (
    <Button
      variant="ghost"
      onClick={() =>
        toast.info("Não permite Edição", {
          description: "Itens cancelados e finalizados não podem ser editados.",
        })
      }
      className="cursor-not-allowed ml-auto p-0"
    >
      <Pencil size={16} className="text-muted-foreground/30" />
    </Button>
  );
}
