"use client";

import { useState } from "react";
import { POLICY_PRESET, type PolicyPreset } from "../constants";
import {
  Check,
  ChevronDown,
  History,
  Scale,
  Server,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PRESET_ICONS: Record<
  PolicyPreset,
  React.ComponentType<{ className?: string }>
> = {
  strict: Shield,
  balanced: Scale,
  legacy: History,
  api: Server,
};

interface Props {
  onSelect: (preset: PolicyPreset) => void;
  className?: string;
}

export function PresetSelctor({ onSelect, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<PolicyPreset | null>(null);

  const handleSelect = (preset: PolicyPreset) => {
    setSelected(preset);
    onSelect(preset);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between gap-1.5 cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          {selected ? (
            <>
              {(() => {
                const Icon = PRESET_ICONS[selected];
                return <Icon className="h-3.5 w-3.5" />;
              })()}
              {POLICY_PRESET[selected].name}
            </>
          ) : (
            <>
              <Shield className="h-3.5 w-3.5" />
              Preset
            </>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg animate-in fade-in slide-in-from-top-1 py-1">
            {(Object.keys(POLICY_PRESET) as PolicyPreset[]).map((preset) => {
              const config = POLICY_PRESET[preset];
              const Icon = PRESET_ICONS[preset];
              const isSelected = selected === preset;

              return (
                <button
                  key={preset}
                  onClick={() => handleSelect(preset)}
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2",
                    isSelected && "bg-muted/50",
                  )}
                >
                  <Icon className="h-4 w-4 text-primary shrink-flex items-center gap-2" />
                  <div className="flex items-center gap-1,5">
                    <span className="text-sm font-medium">{config.name}</span>
                    {isSelected && <Check className="h-3 w-3 text-primary" />}
                  </div>
                  {/* <p className="text-xs text-muted-foreground truncate">
                    {config.description}
                  </p> */}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
