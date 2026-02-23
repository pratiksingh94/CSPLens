import { ClassifiedRule, CSPSource, ParsedRule } from "@/types";


const classifySource = (src: string): CSPSource => {
    const normalized = src.startsWith("'") && src.endsWith("'") ? src.slice(1, -1) : src;

    if(normalized === "*") return { kind: "wildcard", value: "*" }
    if(normalized.startsWith("nonce-")) return { kind: "nonce", value: normalized }
    if(normalized.endsWith(":")) return { kind: "scheme", value: normalized }
    if(["self", "none", "unsafe-inline", "unsafe-eval"].includes(normalized)) return { kind: "keyword", value: normalized }

    return { kind: "host", value: normalized }
}

const classifyCSP = (parsedCSP: ParsedRule[]): ClassifiedRule[] => {
    let classifiedRules: ClassifiedRule[] = [];

    parsedCSP.forEach(rule => {
        let classifiedSources: CSPSource[] = []
        rule.sources.forEach(source => {
            classifiedSources.push(classifySource(source))
        })

        classifiedRules.push({
            directive: rule.directive,
            sources: classifiedSources
        })
    })

    return classifiedRules
}


export default classifyCSP;