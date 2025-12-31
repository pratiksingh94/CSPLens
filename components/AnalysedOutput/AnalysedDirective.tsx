"use client";

import { AnalysedRule,Level } from "@/types";
import { Badge } from "../ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


type Props = {
    rule: AnalysedRule;
};

const levelClasses = {
    GOOD: "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
    OK: "bg-ok text-ok-foreground hover:bg-ok/80 hoveer:text-ok-foreground",
    WARNING: "bg-warning text-warning-foreground hover:bg-warning hover:text-warning-foreground",
    DANGER: "bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:text-destructive-foreground",
    INVALID: "bg-card text-muted-foreground border border-border hover:bg-card/80 hover:text-muted-foreground",
} as const;

export default function AnalysedDirective({ rule }: Props) {
    return (
        <div>
            <p className="text-lg font-bold p-2"><code>{rule.directive}</code></p>
            <TooltipProvider delayDuration={150}>
            {rule.sources.map(s => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge className={`mx-1 ${levelClasses[s.level]}`}>{s.source.value}</Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm bg-foreground">
                            <p>{s.reason}</p>
                        </TooltipContent>
                    </Tooltip>
            ))}
            </TooltipProvider>
            <br/><br/>
            <hr/>
        </div>
    )
}
