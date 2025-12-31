import { AnalysedCSPSource, AnalysedRule, ClassifiedRule, CSPSource, evaluatedOutcome, Level } from "@/types";
import { getRulesForDirective } from "./analyser-rules";


const evaluateSources = (directive: string, src: CSPSource): evaluatedOutcome => {
    const rules = getRulesForDirective(directive);

    for(const rule of rules) {
        if(rule.when(src)) {
            return { level: rule.level, reason: rule.reason }
        }
    }

    return { level: "OK", reason: "OK" }
}

const analyseCSP = (rules: ClassifiedRule[]): AnalysedRule[] => {
    let analysedRules: AnalysedRule[] = []

    for(const rule of rules) {
        let evaluated: AnalysedCSPSource[] = []
        for(const source of rule.sources) {
            let evaluationOutcome = evaluateSources(rule.directive, source);
            evaluated.push({
                source,
                level: evaluationOutcome.level,
                reason: evaluationOutcome.reason
            })
        }

        analysedRules.push({
            directive: rule.directive,
            sources: evaluated
        })
    }

    return analysedRules
}


export default analyseCSP;