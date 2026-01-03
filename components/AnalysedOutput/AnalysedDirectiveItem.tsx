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
import levelClasses from "@/lib/level-classes";

type Props = {
  rule: AnalysedRule;
};

export default function AnalysedDirective({ rule }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between px-2 py-1">
      <h3 className="text-base font-semibold text-foreground">
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
      {rule.directive}
    </code>
  </h3>

  <span className="text-xs text-muted-foreground">
    {rule.sources.length} source{rule.sources.length !== 1 && "s"}
  </span>
  </div>
  <div className="px-2">
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
</div>
    </div>
  );
}
