import { ParsedRule, Rule } from "@/types";

// this one was a little mid
// const parseCSP = (header: string): ParsedRule[] => {
//     let rules = header.split(";");
//     let ruleList: ParsedRule[] = [];

//     rules.forEach((e, i) => {
//         const rule = e.trim().split(/\s+/);

//         const directive = rule.shift();
//         if(!directive) return;

//         const sources = rule.map(s => s.replace(/'/g, ""))

//         let ruleObj: ParsedRule = {
//             directive,
//             sources
//         }

//         ruleList.push(ruleObj)
//     })

//     return ruleList
// }

// TODO: HANDLE HEADER NAME TOO

const parseCSP = (header: string): ParsedRule[] => {
  const directiveMap = new Map<string, string[]>();
  header
    .split(";")
    .map(part => part.trim())
    .filter(Boolean)
    .forEach(part => {
      const tokens = part.split(/\s+/);
      const directive = tokens.shift()?.toLowerCase();
      if (!directive) return;

      const sources = tokens.map(s =>
        s.startsWith("'") && s.endsWith("'")
          ? s.slice(1, -1)
          : s
      );

      if (!directiveMap.has(directive)) {
        directiveMap.set(directive, []);
      }

      directiveMap.get(directive)!.push(...sources);
    });

  return Array.from(directiveMap.entries()).map(
    ([directive, sources]) => ({
      directive,
      sources,
    })
  );
};




export default parseCSP;