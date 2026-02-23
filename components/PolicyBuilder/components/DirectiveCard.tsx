"use client";

import { AlertCircle, Ban, Box, ChevronDown, Code, Cpu, FileJson, Frame, Image, Layers, Link, Lock, Palette, Send, Shield, Type, Video, Wifi } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { SourceChip } from "./SourceChip";
import { SourceInput } from "./SourceInput";
import { isDirectiveImportant, type DirectiveInfo } from "../constants";
import type { DirectiveState } from "../hooks/usePolicyBuilder";

const ICON_MAP: Record<string, React.ComponentType<{className: string}>> = {
  Shield,
  Code,
  Palette,
  Image,
  Wifi,
  Type,
  Video,
  Box,
  Frame,
  Layers,
  Cpu,
  FileJson,
  Link,
  Send,
  Lock,
  Ban
}


interface Props {
  directive: DirectiveInfo;
  state: DirectiveState;
  onToggle: () => void;
  onAddSource: (source: string) => void;
  onRemoveSource: (source: string) => void;
}



export function DirectiveCard({directive, state, onToggle, onAddSource, onRemoveSource}: Props) {
  const [isExpanded, setIsExpanded] = useState(state.enabled);
  const Icon = ICON_MAP[directive.icon] || Shield;

  return (
    <div className={cn("rounded-md border transition-all", state.enabled ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card hover:border-border")}>
      <div className="flex items-center gap-2 p-2.5">
        <div className={cn("p-1.5 rounded shrink-0", state.enabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
          <Icon className="h-4 w-4"/>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <code className={cn("text-sm font-medium", state.enabled ? "text-foreground" : "text-muted-foreground")}>
              {directive.name}
            </code>
            {isDirectiveImportant(directive.name) && !state.enabled && (<AlertCircle className="h-3 w-3 text-warning"/>)}
            {state.enabled && state.sources.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                {state.sources.length}
              </span>
            )}
          </div>
        </div>

        <button onClick={() => setIsExpanded(!isExpanded)} className=
        {cn("p-1 rounded hover:bg-muted transition-transform cursor-pointer", isExpanded && "rotate-180")}>
          <ChevronDown className="h-4 w-4 text-muted-foreground"/>
        </button>

        <Switch checked={state.enabled} onCheckedChange={() => {
          onToggle();
          if(!state.enabled) setIsExpanded(true);
        }} className="scale-90"/>
      </div>




      {isExpanded && (
        <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 fade-in">
          <div className="space-y-2">
            {state.sources.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {state.sources.map(source => (
                  <SourceChip
                  key={source}
                  source={source}
                  onRemove={() => onRemoveSource(source)}
                  />
                ))}
              </div>
            )}

            <SourceInput
            onAdd={onAddSource}
            disabled={!state.enabled}
            placeholder={state.enabled ? "Add source" : "Enable first"}
            />

            {state.enabled && (
              <div className="flex flex-wrap gap-1.5">
                {["'self'", "'none'", "*"].map(quick => (
                  <button
                  key={quick}
                  onClick={() => !state.sources.includes(quick) && onAddSource(quick)}
                  disabled={state.sources.includes(quick)}
                  className={cn("px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer", state.sources.includes(quick) ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary/10 text-primary hover:bg-primary/20")}
                  >+{quick}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}