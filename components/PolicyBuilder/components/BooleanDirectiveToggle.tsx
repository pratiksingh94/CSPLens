"use client";

import { Lock, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Lock,
  Ban,
};

interface Props {
  name: string;
  icon: string;
  enabled: boolean;
  onToggle: () => void;
}

export function BooleanDirectiveToggle({
  name,
  icon,
  enabled,
  onToggle,
}: Props) {
  const Icon = ICON_MAP[icon] || Lock;

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-md border transition-colors",
      enabled
        ? "border-primary/30 bg-primary/5"
        : "border-border/50 bg-card hover:border-border"
    )}>
      <div className={cn(
        "p-1 rounded shrink-0",
        enabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        <code className={cn(
          "text-xs font-medium",
          enabled ? "text-foreground" : "text-muted-foreground"
        )}>
          {name}
        </code>
      </div>

      <Switch checked={enabled} onCheckedChange={onToggle} className="scale-75" />
    </div>
  );
}
