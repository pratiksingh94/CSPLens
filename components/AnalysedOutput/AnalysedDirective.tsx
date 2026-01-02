"use client";

import { AnalysedRule, Level } from "@/types";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  rule: AnalysedRule;
};

const levelClasses = {
  GOOD: "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
  OK: "bg-ok text-ok-foreground hover:bg-ok/80 hoveer:text-ok-foreground",
  WARNING:
    "bg-warning text-warning-foreground hover:bg-warning hover:text-warning-foreground",
  DANGER:
    "bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:text-destructive-foreground",
  INVALID:
    "bg-card text-muted-foreground border border-border hover:bg-card/80 hover:text-muted-foreground",
} as const;

export default function AnalysedDirective({ rule }: Props) {
  return (
    <div>
      <p className="text-lg font-bold p-2">
        <code>{rule.directive}</code>
      </p>
      <TooltipProvider delayDuration={150}>
        {rule.sources.map((s, i) => (
          <Tooltip key={`${rule.directive}-${i}`}>
            <TooltipTrigger asChild>
              <Badge className={`mx-1 ${levelClasses[s.level]}`}>
                {s.source.value}
              </Badge>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "max-w-xs rounded-md border bg-background p-3 shadow-md",
                s.level === "DANGER" && "border-l-4 border-l-destructive",
                s.level === "WARNING" && "border-l-4 border-l-warning",
              )}
            >
              {/* Reason */}
              <p className="font-medium leading-snug text-foreground">
                {s.reason}
              </p>

              {/* Recommendation */}
              {s.recommendation && (
                <p className="mt-2 text-sm text-foreground/80">
                  <span className="font-medium text-foreground">Fix:</span>{" "}
                  {s.recommendation}
                </p>
              )}

              {/* Reference */}
              {s.references && (
                <a
                  href={s.references.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-xs text-primary hover:underline"
                >
                  {s.references.label}
                </a>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      <br />
      <br />
      <hr />
    </div>
  );
}
