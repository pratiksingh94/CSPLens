import levelClasses from "@/lib/level-classes";
import { Level } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";

const LEVEL_META: Record<Level, { description: string }> = {
  GOOD: {
    description:
      "Safe and recommended source expression (e.g. 'self' or trusted origins)."
  },
  OK: {
    description:
      "Generally acceptable, but may increase exposure depending on the directive."
  },
  WARNING: {
    description:
      "Risky source expression that weakens the CSP and should be avoided if possible."
  },
  DANGER: {
    description:
      "Dangerous source expression (e.g. unsafe-inline or unsafe-eval) that significantly reduces security."
  },
  INVALID: {
    description:
      "This source expression is not valid for the given directive (e.g. unsafe-eval in style-src)."
  }
};

export default function Help() {
  return (
    <div className="mt-4 rounded-md border border-border/50 bg-primary/5 p-4 shadow-sm">
      <p className="mb-3 text-center text-sm text-foreground">
        Source expression risk levels (hover!)
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(LEVEL_META) as Level[]).map((level) => (
          <Tooltip key={level}>
            <TooltipTrigger asChild>
              <Badge
                className={`${levelClasses[level]}`}
              >
                {level}
              </Badge>
            </TooltipTrigger>

            <TooltipContent className="max-w-xs rounded-md border bg-background p-3 shadow-md">
              <p className="text-sm leading-snug text-foreground">
                {LEVEL_META[level].description}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
