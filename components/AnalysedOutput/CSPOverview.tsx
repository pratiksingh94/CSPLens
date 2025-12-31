"use client";

import getCSPOverview from "@/lib/csp-overview";
import { AnalysedRule } from "@/types";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const levelClasses = {
  GOOD: "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
  OK: "bg-ok text-ok-foreground hover:bg-ok/80 hover:text-ok-foreground",
  WARNING:
    "bg-warning text-warning-foreground hover:bg-warning hover:text-warning-foreground",
  DANGER:
    "bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:text-destructive-foreground",
  INVALID:
    "bg-card text-muted-foreground border border-border hover:bg-card/80 hover:text-muted-foreground",
} as const;

type Props = {
  data: AnalysedRule[];
};

export default function CSPOverview({ data }: Props) {
  const overview = getCSPOverview(data);
  console.log(overview);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <section className="rounded-md border bg-card p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Stats
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{overview.count}</span>
          <span className="text-muted-foreground">directives</span>
        </div>

        <div className="mt-2 text-sm text-muted-foreground">
          {overview.uniqueSources.length} unique sources
        </div>
      </section>
      <section className="rounded-md border bg-card p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Unique Sources
        </h3>

        <div className="flex flex-wrap">
          {overview.uniqueSources.map((s) => (
            <Badge
              key={s.source.value}
              className={`m-1 ${levelClasses[s.level]}`}
            >
              {s.source.value}
            </Badge>
          ))}
        </div>
      </section>
      <section className="md:col-span-2 rounded-md border border-destructive/40 bg-destructive/10 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-destructive mb-2">
          🚨 Red Flags
        </h3>

        <div className="flex flex-wrap">
          {overview.redFlags.map((s) => (
            <Badge
              key={s.source.value}
              className={`m-1 ${levelClasses[s.level]}`}
            >
              {s.source.value}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
