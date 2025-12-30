"use client";

import { AnalysedRule } from "@/types";
import AnalysedDirective from "@/components/AnalysedOutput/AnalysedDirective";


type Props = {
  data: AnalysedRule[]
}

export default function PolicyBreakdown({data}: Props) {
  return (
    <div className="mt-4 rounded-md bg-primary/5 p-4 shadow-sm border border-border/50">
      <h2 className="text-2xl my-3 font-extrabold tracking-tight">Directive Analysis</h2>
      <p className="text-muted-foreground">Good and bad stuff from each directive</p>
      <div className="my-4 h-px bg-border/60" />
      {data.map((d) => (
        <AnalysedDirective rule={d} key={d.directive}/>
      ))}
    </div>
  );
}
