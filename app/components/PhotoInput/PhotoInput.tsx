"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function PhotoInput({
  value,
  onChangeAction,
  document,
}: {
  value: File | undefined;
  onChangeAction: (file: File | undefined) => void;
  document?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- necessary to prevent an image bug
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);

    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onChangeAction(e.target.files?.[0])}
      />

      {previewUrl ? (
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element -- object URL, not a static/remote asset */}
          <img
            src={previewUrl}
            alt="Prévia da foto"
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-9 w-9 rounded-full"
            onClick={() => {
              onChangeAction(undefined);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            <X size={18} />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="flex h-32 w-full flex-col gap-2 border-2 border-dashed text-base"
          onClick={() => inputRef.current?.click()}
        >
          <Camera size={28} />
          {document || "Tirar foto"}
        </Button>
      )}
    </div>
  );
}
