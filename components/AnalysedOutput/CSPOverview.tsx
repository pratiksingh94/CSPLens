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

      {/* ==== STATS ==== */}
      <section className="rounded-md border bg-card p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Policy Grade
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-destructive">{overview.policyGrade.grade}</span>
          <span className="text-sm text-muted-foreground">- Security Score: {overview.policyGrade.score}/100</span>
        </div>

        {overview.policyGrade.cappedBy && (
        <div className="mt-2 text-sm text-muted-foreground">
          Grade capped at D: <span className="text-destructive">{overview.policyGrade.cappedBy}</span>
        </div>
        )}


        <div className="mt-2 text-sm text-muted-foreground">
          Based on detected dangerous and risky CSP directives
        </div>
      </section>

      {/* ==== UNIQUE SOURCES ==== */}
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

      {/* ==== RED FLAHS ==== */}
      <section className="md:col-span-2 rounded-md border border-destructive/40 bg-card p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-destructive mb-1 flex items-center gap-2">
          🚨 Red Flags
        </h3>

        <p className="text-sm text-destructive/90 mb-3">
          {overview.redFlags.length} high-risk CSP issues detected
        </p>
        
        {/* <div className="flex flex-wrap gap-2">
          {overview.redFlags.map((s) => (
            <Badge
              className="
    bg-muted text-foreground
    border border-destructive/40
    font-medium
    flex items-center gap-1
  "
            >
              <span className="text-destructive">⚠</span>
              {s.source.value}
            </Badge>
          ))}
        </div> */}
        <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {overview.redFlags.map((flag) => (
            <Tooltip key={flag.key}>
              <TooltipTrigger asChild>
                <Badge className="bg-muted text-foreground border border-destructive/40 font-medium flex items-center gap-1 hover:bg-destructive/20">
                  <span className="text-destructive">⚠</span>
                  {flag.key}
                  <span className="text-xs text-muted-foreground ml-1">
                    · {flag.directives.length}
                  </span>
                </Badge>
              </TooltipTrigger>

              <TooltipContent className="max-w-xs rounded-md border bg-background p-3 shadow-md border-l-4 border-l-destructive">
                <p className="font-medium leading-snug text-foreground">{flag.reason}</p>

                <p className="mt-2 text-sm text-foreground">
                  Seen in: {flag.directives.join(", ")}
                </p>

                {flag.recommendation && (
                  <p className="mt-2 text-sm text-foreground/80">
                    <span className="font-medium text-foreground">Fix:</span>{" "}
                    {flag.recommendation}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        </TooltipProvider>
      </section>
    </div>
  );
}
