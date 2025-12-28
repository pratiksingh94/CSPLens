import { ClassifiedRule, CSPSource, ParsedRule } from "@/types";


const classifySource = (src: string): CSPSource => {
    if(src === "*") return { kind: "wildcard" }
    if(src.startsWith("nonce-")) return { kind: "nonce", value: src }
    if(src.endsWith(":")) return { kind: "scheme", value: src }
    if(["self", "none", "unsafe-inline", "unsafe-eval"].includes(src)) return { kind: "keyword", value: src }

    return { kind: "host", value: src }
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