import { AnalysedCSPSource, AnalysedRule, ClassifiedRule, CSPSource, Level } from "@/types";
import { getRulesForDirective } from "./analyser-rules";


const evaluateSources = (directive: string, src: CSPSource): Level => {
    const rules = getRulesForDirective(directive);

    for(const rule of rules) {
        if(rule.when(src)) {
            return rule.level
        }
    }

    return "OK"
}

const analyseCSP = (rules: ClassifiedRule[]): AnalysedRule[] => {
    let analysedRules: AnalysedRule[] = []

    for(const rule of rules) {
        let evaluated: AnalysedCSPSource[] = []
        for(const source of rule.sources) {
            evaluated.push({
                source,
                level: evaluateSources(rule.directive, source)
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