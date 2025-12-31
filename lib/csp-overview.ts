import { AnalysedCSPSource, AnalysedRule } from "@/types";

const getCSPOverview = (csp: AnalysedRule[]) => {
  const count = csp.length;
  const uniqueSources = getUniqueSources(csp);
  const redFlags = getRedFlags(csp);

  return {
    count,
    uniqueSources,
    redFlags,
  };
};

const getUniqueSources = (csp: AnalysedRule[]) => {
  const seen: string[] = [];
  const unique: AnalysedCSPSource[] = [];

  for (const r of csp) {
    for (const d of r.sources) {
      if (d.source.kind === "host" || d.source.kind === "scheme") {
        if (!seen.includes(d.source.value)) {
          seen.push(d.source.value);
          unique.push(d);
        }
        continue;
      }
    }
  }

  return unique;
};

const getRedFlags = (csp: AnalysedRule[]) => {
  const redFlags: AnalysedCSPSource[] = [];
  for (const r of csp) {
    for (const d of r.sources) {
      if (d.level === "DANGER") redFlags.push(d);
    }
  }

  return redFlags;
};

export default getCSPOverview;
