import { AnalysedRule, AttackSurfaceItem } from "@/types";
import AttackSurfaceItemComp from "./AttackSurfaceItem";
import buildAttackSurface from "@/lib/attack-surface";

type Props = {
    data: AnalysedRule[];
}

export default function AttackSurface({ data }: Props) {
    const surface = buildAttackSurface(data)
    return (
        <div className="mt-4 rounded-md bg-primary/5 p-4 shadow-sm border border-border/50">
            <h2 className="text-2xl my-3 font-extrabold tracking-tight">Attack Surface</h2>
            <p className="text-muted-foreground">Exploitable behaviours enabled by this CSP configuration</p>

            <div className="my-4 h-px bg-border/60"/>

            {surface.length === 0 ? (
                <p className="text-sm text-muted-foreground">No significant attack surface detected. Good job.</p>
            ) : (
                surface.map(item => (
                    <AttackSurfaceItemComp key={item.id} item={item}/>
                ))
            )}
        </div>
    )
}