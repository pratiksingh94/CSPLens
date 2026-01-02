import { AnalysedCSPSource, AnalysedRule, ClassifiedRule, CSPSource, evaluatedOutcome, Level } from "@/types";
import { getRulesForDirective } from "./analyser-rules";


const evaluateSources = (directive: string, src: CSPSource): evaluatedOutcome => {
    const rules = getRulesForDirective(directive);

    // note for self: rule are evaluated from top to bottom and first matching wins
    for(const rule of rules) {
        if(rule.when(src)) {
            return { level: rule.level, reason: rule.reason, recommendation: rule.recommendation, references: rule.references }
        }
    }

    return { level: "OK", reason: "OK, just be careful who you trust." }
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
                reason: evaluationOutcome.reason,
                recommendation: evaluationOutcome.recommendation,
                references: evaluationOutcome.references
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