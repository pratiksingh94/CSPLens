"use client";

import { MissingDirective } from "@/types";
import { Badge } from "../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import levelClasses from "@/lib/level-classes";

type Props = {
  d: MissingDirective;
};

export default function MissingDirectiveItem({ d }: Props) {
  return (
    <div>
      {/* <p className="text-lg font-bold p-2">
        <code>{d.directive}</code>
      </p> */}
        
          <Tooltip key={`${d.directive}`}>
            <TooltipTrigger asChild>
              <Badge className={`mx-1 ${levelClasses["WARNING"]}`}>
                {d.directive}
              </Badge>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-xs rounded-md border bg-background p-3 shadow-md border-l-4 border-l-warning"
            >
              {/* importance of the directive  */}
              <p className="font-medium leading-snug text-foreground">
                {d.importance}
              </p>

              {/* Recommendation */}
              {d.recommendation && (
                <p className="mt-2 text-sm text-foreground/80">
                  <span className="font-medium text-foreground">Recommendation:</span>{" "}
                  {d.recommendation}
                </p>
              )}

              {/* Reference */}
              {d.references && (
                <a
                  href={d.references?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-xs text-primary hover:underline"
                >
                  {d.references?.label}
                </a>
              )}
        
            </TooltipContent>
          </Tooltip>
    </div>
  );
}
