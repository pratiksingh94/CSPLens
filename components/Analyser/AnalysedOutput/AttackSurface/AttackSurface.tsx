import { AnalysedRule } from "@/types";
import AttackSurfaceItemComp from "./AttackSurfaceItem";
import buildAttackSurface from "@/lib/attack-surface";
import { AlertTriangle, ShieldCheck } from "lucide-react";

type Props = {
  data: AnalysedRule[];
};

export default function AttackSurface({ data }: Props) {
  const surface = buildAttackSurface(data);

  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h2 className="text-xl font-bold">Attack Surface</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Exploitable behaviours enabled by this CSP configuration
      </p>

      <div className="mt-4 space-y-3">
        {surface.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-emerald-600 p-3 rounded-lg bg-emerald-500/10">
            <ShieldCheck className="h-4 w-4" />
            <span>No significant attack surface detected. Good job!</span>
          </div>
        ) : (
          surface.map((item) => (
            <AttackSurfaceItemComp key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
