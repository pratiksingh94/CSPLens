import { ParsedRule, Rule } from "@/types";


const parseCSP = (header: string): ParsedRule[] => {
    let rules = header.split(";");
    let ruleList: ParsedRule[] = [];

    rules.forEach((e, i) => {
        const rule = e.trim().split(/\s+/);

        const directive = rule.shift();
        if(!directive) return;

        const sources = rule.map(s => s.replace(/'/g, ""))

        let ruleObj: ParsedRule = {
            directive,
            sources
        }

        ruleList.push(ruleObj)
    })

    return ruleList
}

export default parseCSP;