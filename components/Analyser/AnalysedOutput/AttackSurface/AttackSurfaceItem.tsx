import { cn } from "@/lib/utils";
import { AttackSurfaceItem } from "@/types";

type Props = {
  item: AttackSurfaceItem;
};

export default function AttackSurfaceItemComp({ item }: Props) {
  return (
    <div
      className={cn(
        "rounded-md border p-4 mb-4 bg-background/60 space-y-3",
        item.severity === "HIGH" && "border-red-500/60 bg-red-500/5",
        item.severity === "MEDIUM" && "border-yellow-500/60 bg-yellow-500/5"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold tracking-tight">
          {item.title}
        </h3>
        <span
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded shrink-0",
            item.severity === "HIGH" && "bg-red-500/20 text-red-400",
            item.severity === "MEDIUM" && "bg-yellow-500/20 text-yellow-400"
          )}
        >
          {item.severity}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {item.impact}
      </p>

      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Enabled by
        </p>

        <div className="flex flex-wrap gap-2">
          {item.causes.map((c, i) => (
            <span
              key={i}
              className="font-mono text-[11px] px-2 py-1 rounded bg-muted/40 text-foreground/80 border border-primary"
            >
              {c.directive}: {c.source};
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
