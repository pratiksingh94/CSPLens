"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Props {
  source: string;
  onRemove: () => void;
}

export function SourceChip({ source, onRemove }: Props) {
  const getVariantClasses = () => {
    if (source === "*") return "bg-destructive/15 text-destructive";
    if (source === "'none'") return "bg-muted text-muted-foreground";
    if (source === "'self'") return "bg-primary/15 text-primary";
    if (source.includes("unsafe")) return "bg-warning/15 text-warning";
    return "bg-muted/50 text-foregrond";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono",
        getVariantClasses(),
      )}
    >
      {source}
      <button
        onClick={onRemove}
        className="hover:opacity-70 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
