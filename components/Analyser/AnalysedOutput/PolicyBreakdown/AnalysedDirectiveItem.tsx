"use client";

import { AnalysedRule } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import levelClasses from "@/lib/level-classes";

type Props = {
  rule: AnalysedRule;
};

export default function AnalysedDirective({ rule }: Props) {
  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <code className="font-semibold font-mono">{rule.directive}</code>
        <span className="text-xs text-muted-foreground ml-auto">
          {rule.sources.length} source{rule.sources.length !== 1 && "s"}
        </span>
      </div>

      {/* Sources */}
      {rule.sources.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {rule.sources.map((s, i) => (
            <Tooltip key={`${rule.directive}-${i}`}>
              <TooltipTrigger asChild>
                <Badge className={cn("cursor-help", levelClasses[s.level])}>
                  {s.source.value}
                </Badge>
              </TooltipTrigger>
              <TooltipContent
                className={cn(
                  "max-w-xs rounded-md border bg-background p-3 shadow-lg",
                  s.level === "DANGER" && "border-l-4 border-l-destructive",
                  s.level === "WARNING" && "border-l-4 border-l-warning",
                  s.level === "GOOD" && "border-l-4 border-l-primary",
                )}
              >
                <p className="font-medium leading-snug text-foreground">
                  {s.reason}
                </p>

                {s.recommendation && (
                  <p className="mt-2 text-sm text-foreground/80">
                    <span className="font-medium text-foreground">Fix:</span>{" "}
                    {s.recommendation}
                  </p>
                )}

                {s.references && (
                  <a
                    href={s.references.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs text-primary hover:underline"
                  >
                    {s.references.label} →
                  </a>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Boolean directive (no sources)
        </p>
      )}
    </div>
  );
}
