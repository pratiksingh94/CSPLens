import { MissingDirective } from "@/types";
import MissingDirectiveItem from "./MissingDirectiveItem";
import { TooltipProvider } from "@/components/ui/tooltip";

type Props = {
  data: MissingDirective[];
};

export default function MissingDirectives({ data }: Props) {
  return (
    <section className="rounded-md border bg-card p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        Missing Important Directives
      </h3>

      <div className="flex flex-wrap">
        {data.map((d) => (
          <MissingDirectiveItem d={d}/>
        ))}
      </div>
    </section>
  );
}
