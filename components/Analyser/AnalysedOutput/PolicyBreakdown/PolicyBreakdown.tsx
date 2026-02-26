"use client";

import { AnalysedRule } from "@/types";
import AnalysedDirective from "./AnalysedDirectiveItem";

type Props = {
  data: AnalysedRule[];
};

export default function PolicyBreakdown({ data }: Props) {
  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-5">
      <h2 className="text-xl font-bold">Policy Breakdown</h2>
      <p className="text-sm text-muted-foreground">Per-directive source analysis</p>
      
      <div className="mt-4 space-y-4">
        {data.map((d) => (
          <AnalysedDirective rule={d} key={d.directive} />
        ))}
      </div>
    </div>
  );
}
