import { ParsedRule } from "@/types";

const KNOWN_DIRECTIVES = new Set([
  "default-src",
  "script-src",
  "style-src",
  "img-src",
  "connect-src",
  "font-src",
  "media-src",
  "object-src",
  "frame-src",
  "frame-ancestors",
  "worker-src",
  "manifest-src",
  "base-uri",
  "form-action",
  "navigate-to",
  "prefetch-src",
  "child-src",
  "sandbox",
  "report-uri",
  "report-to",
]);

const normalizeHeader = (header: string): string => {
  const trimmed = header.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith("content-security-policy:")) {
    return trimmed.slice("content-security-policy:".length).trim()
  }

  if (lower.startsWith("content-security-policy-report-only:")) {
    return trimmed
      .slice("content-security-policy-report-only:".length)
      .trim()
  }

  return trimmed;
};

const parseCSP = (header: string): ParsedRule[] => {
  const directiveMap = new Map<string, string[]>();
  const normalized = normalizeHeader(header);

  let currentDirective: string | null = null;

  for (const part of normalized.split(";")) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;

    const first = tokens[0].toLowerCase()

    if (KNOWN_DIRECTIVES.has(first)) {
      currentDirective = tokens.shift()!.toLowerCase();

      if (!directiveMap.has(currentDirective)) {
        directiveMap.set(currentDirective, []);
      }
    }

    if (!currentDirective) continue;

    const sources = tokens.map((t) =>
      t.startsWith("'") && t.endsWith("'") ? t.slice(1, -1) : t
    );

    directiveMap.get(currentDirective)!.push(...sources)
  }

  return Array.from(directiveMap.entries()).map(([directive, sources]) => ({
    directive,
    sources,
  }));
};

export default parseCSP;
