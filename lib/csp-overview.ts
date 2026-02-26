import {
  AnalysedCSPSource,
  AnalysedRule,
  MissingDirective,
  RedFlag,
} from "@/types";
import IMPORTANT_DIRECTIVES from "./missing-directives";

// SCORING CONFIGUREATION
const PENALTIES = {
  DANGER_SOURCE: 12,
  WARNING_SOURCE: 4,
  WILDCARD_IN_SCRIPT: 20,
  MISSING_CRITICAL: 15,
  MISSING_IMPORTANT: 8,
};

const BONUSES = {
  HAS_UPGRADE_INSECURE: 5,
  USES_NONCES: 8,
  USES_HASHES: 5,
  USES_STRICT_DYNAMIC: 5,
  HAS_DEFAULT_NONE: 5,
  HAS_REPORTING: 3,
  NO_UNSAFE_IN_SCRIPTS: 5,
};

type ScoreFactor = {
  type: "penalty" | "bonus";
  amount: number;
  reason: string;
};

type PolicyGradeResult = {
  score: number;
  grade: string;
  cappedBy: string | undefined;
  factors: ScoreFactor[];
};

const getCSPOverview = (csp: AnalysedRule[]) => {
  const count = csp.length;
  const uniqueSources = getUniqueSources(csp);
  const redFlags = getRedFlags(csp);
  const missingDirectives = getMissingDirectives(csp);
  const policyGrade = getPolicyGrade(csp, missingDirectives);

  return {
    count,
    uniqueSources,
    redFlags,
    policyGrade,
    missingDirectives,
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

  return unique;
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

const getPolicyGrade = (rules: AnalysedRule[], missingDirectives: MissingDirective[]): PolicyGradeResult => {
  let score = 100;
  const factors: ScoreFactor[] = [];


  let hasScriptUnsafeInline = false;
  let hasScriptUnsafeEval = false;
  let usesNonces = false;
  let usesHashes = false;
  let usesStrictDynamic = false;
  let hasUpgradeInsecure = false;
  let hasReporting = false;

  for (const rule of rules) {
    if (rule.directive === "upgrade-insecure-requests" && rule.sources.length === 0) {
      hasUpgradeInsecure = true;
    }
    if (rule.directive === "report-uri" || rule.directive === "report-to") {
      hasReporting = true;
    }

    for (const src of rule.sources) {
      //  SOURCE LEVEL 
      if (src.level === "DANGER") {
        factors.push({ type: "penalty", amount: PENALTIES.DANGER_SOURCE, reason: `${rule.directive}: ${src.source.value} (DANGER)` });
      }
      if (src.level === "WARNING") {
        factors.push({ type: "penalty", amount: PENALTIES.WARNING_SOURCE, reason: `${rule.directive}: ${src.source.value} (WARNING)` });
      }

      // SCRIPT SPECEFIC
      if (rule.directive === "script-src") {
        if (src.source.kind === "keyword" && src.source.value === "unsafe-inline") {
          hasScriptUnsafeInline = true;
          factors.push({ type: "penalty", amount: PENALTIES.WILDCARD_IN_SCRIPT, reason: "script-src: unsafe-inline is critical XSS risk" });
        }
        if (src.source.kind === "keyword" && src.source.value === "unsafe-eval") {
          hasScriptUnsafeEval = true;
          factors.push({ type: "penalty", amount: PENALTIES.WILDCARD_IN_SCRIPT, reason: "script-src: unsafe-eval enables code injection" });
        }
        if (src.source.kind === "wildcard") {
          factors.push({ type: "penalty", amount: PENALTIES.WILDCARD_IN_SCRIPT, reason: "script-src: wildcard allows any script source" });
        }
      }

      if (src.source.kind === "nonce") usesNonces = true;
      if (src.source.kind === "hash") usesHashes = true;
      if (src.source.kind === "keyword" && src.source.value === "strict-dynamic") usesStrictDynamic = true;
    }
  }

  const defaultSrc = rules.find(r => r.directive === "default-src");
  const hasDefaultNone = defaultSrc?.sources.some(s => s.source.kind === "keyword" && s.source.value === "none");

  // MISSING DIRS
  for (const missing of missingDirectives) {
    if (missing.importanceLevel === "critical") {
      factors.push({ type: "penalty", amount: PENALTIES.MISSING_CRITICAL, reason: `Missing ${missing.directive} (critical)` });
    } else if (missing.importanceLevel === "important") {
      factors.push({ type: "penalty", amount: PENALTIES.MISSING_IMPORTANT, reason: `Missing ${missing.directive} (important)` });
    }
  }

  // BONUSES
  if (hasUpgradeInsecure) {
    factors.push({ type: "bonus", amount: BONUSES.HAS_UPGRADE_INSECURE, reason: "Has upgrade-insecure-requests" });
  }
  if (usesNonces) {
    factors.push({ type: "bonus", amount: BONUSES.USES_NONCES, reason: "Uses nonces for inline scripts" });
  }
  if (usesHashes && !usesNonces) {  // Don't double count if already has nonces
    factors.push({ type: "bonus", amount: BONUSES.USES_HASHES, reason: "Uses hashes for inline scripts" });
  }
  if (usesStrictDynamic && !usesNonces && !usesHashes) {
    factors.push({ type: "bonus", amount: BONUSES.USES_STRICT_DYNAMIC, reason: "Uses strict-dynamic" });
  }
  if (hasDefaultNone) {
    factors.push({ type: "bonus", amount: BONUSES.HAS_DEFAULT_NONE, reason: "Uses default-src 'none' (best practice)" });
  }
  if (hasReporting) {
    factors.push({ type: "bonus", amount: BONUSES.HAS_REPORTING, reason: "Has CSP violation reporting" });
  }
  if (!hasScriptUnsafeInline && !hasScriptUnsafeEval) {
    const scriptSrc = rules.find(r => r.directive === "script-src");
    if (scriptSrc) {
      factors.push({ type: "bonus", amount: BONUSES.NO_UNSAFE_IN_SCRIPTS, reason: "No unsafe-* in script-src" });
    }
  }

  for (const factor of factors) {
    if (factor.type === "penalty") {
      score -= factor.amount;
    } else {
      score += factor.amount;
    }
  }

  let cappedBy: string | undefined;
  if (hasScriptUnsafeInline || hasScriptUnsafeEval) {
    if (score > 60) {
      score = 60;
      cappedBy = "XSS protection disabled (unsafe-inline/unsafe-eval in script-src)";
    }
  }

  score = Math.max(0, Math.min(100, score));

  let grade: string;
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  return { score, grade, cappedBy, factors };
};


const getMissingDirectives = (csp: AnalysedRule[]): MissingDirective[] => {
  const existing = new Set(csp.map(r => r.directive));

  return IMPORTANT_DIRECTIVES.filter(imp => !existing.has(imp.directive))
}

export default getCSPOverview;
