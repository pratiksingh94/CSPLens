import { AnalysedCSPSource, AnalysedRule, RedFlag } from "@/types";

const getCSPOverview = (csp: AnalysedRule[]) => {
  const count = csp.length;
  const uniqueSources = getUniqueSources(csp);
  const redFlags = getRedFlags(csp);
  const policyGrade = getPolicyGrade(csp);

  return {
    count,
    uniqueSources,
    redFlags,
    policyGrade
  };
};

const getUniqueSources = (csp: AnalysedRule[]) => {
  const seen = new Set<string>();
  const unique: AnalysedCSPSource[] = [];

  for (const r of csp) {
    for (const d of r.sources) {
      if (d.source.kind === "host" || d.source.kind === "scheme") {
        if (!seen.has(d.source.value)) {
          seen.add(d.source.value);
          unique.push(d);
        }
      }
    }
  }

  return unique
};

const getRedFlags = (rules: AnalysedRule[]): RedFlag[] => {
  const map = new Map<string, RedFlag>();

  for (const r of rules) {
    for (const src of r.sources) {
      if (src.level !== "DANGER") continue;

      const key = src.source.value;

      if (!map.has(key)) {
        map.set(key, {
          key,
          level: "DANGER",
          reason: src.reason,
          recommendation: src.recommendation,
          references: src.references,
          directives: [],
          count: 0,
        });
      }

      const entry = map.get(key)!;
      entry.count++;
      entry.directives.push(r.directive);
    }
  }

  // dedupe directives at the end
  return Array.from(map.values()).map((f) => ({
    ...f,
    directives: Array.from(new Set(f.directives)),
  }));
};


const getPolicyGrade = (rules: AnalysedRule[]) => {
  let score = 100;

  let hasScriptUnsafeInline = false;
  let hasScriptUnsafeEval = false;

  for (const rule of rules) {
    for (const src of rule.sources) {
      if (src.level === "DANGER") score -= 15;
      if (src.level === "WARNING") score -= 5;

      // easy to extend but there must be a better way to do this
      if (
        rule.directive === "script-src" &&
        src.source.kind === "keyword"
      ) {
        if (src.source.value === "unsafe-inline") {
          hasScriptUnsafeInline = true;
          score -= 25;
        }

        if (src.source.value === "unsafe-eval") {
          hasScriptUnsafeEval = true;
          score -= 25;
        }
      }
    }
  }


  if (hasScriptUnsafeInline || hasScriptUnsafeEval) {
    score = Math.min(score, 60); // no XSS = no more than D lmao
  }

  
  score = Math.max(0, Math.min(100, score));

  if (score >= 90) return { score, grade: "A" };
  if (score >= 80) return { score, grade: "B" };
  if (score >= 70) return { score, grade: "C" };
  if (score >= 60) return { score, grade: "D", cappedBy: hasScriptUnsafeInline || hasScriptUnsafeEval
    ? "XSS protection disabled"
    : undefined };
  return { score, grade: "F" };
};



export default getCSPOverview;
