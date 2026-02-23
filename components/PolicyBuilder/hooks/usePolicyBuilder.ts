"use client";

import { useCallback, useMemo, useState } from "react";

import { POLICY_PRESET, type PolicyPreset } from "../constants";
import { getRulesForDirective } from "@/lib/analyser-rules";
import IMPORTANT_DIRECTIVES from "@/lib/missing-directives";
import analyse from "@/lib/analyse-csp";
import getCSPOverview from "@/lib/csp-overview";
import buildAttackSurface from "@/lib/attack-surface";
import classifyCSP from "@/lib/csp-classifier";
import parseCSP from "@/lib/csp-parser";

export type DirectiveState = {
  enabled: boolean;
  sources: string[];
};

export type PolicyState = Map<string, DirectiveState>;

export type SourceValidation = {
  level: "GOOD" | "OK" | "WARNING" | "DANGER" | "INVALID";
  reason: string;
  recommendation?: string;
  attackClass?: string;
};

export function usePolicyBuilder() {
  // empty state
  const [policy, setPolicy] = useState<PolicyState>(() => new Map());
  const [booleanDirectives, setBooleanDirectives] = useState<Set<string>>(
    () => new Set(),
  );
  const [reportOnly, setReportOnly] = useState(false);

  // toggle directive
  const toggleDirective = useCallback((directive: string) => {
    setPolicy((prev) => {
      const next = new Map(prev);
      const current = next.get(directive);
      if (current) {
        next.set(directive, { ...current, enabled: !current.enabled });
      } else {
        next.set(directive, { enabled: true, sources: [] });
      }
      return next;
    });
  }, []);

  // add source
  const addSource = useCallback((directive: string, source: string) => {
    const trimmed = source.trim();
    if (!trimmed) return;

    setPolicy((prev) => {
      const next = new Map(prev);
      const current = next.get(directive);
      if (current) {
        if (!current.sources.includes(trimmed)) {
          next.set(directive, {
            ...current,
            enabled: true,
            sources: [...current.sources, trimmed],
          });
        }
      } else {
        next.set(directive, {
          enabled: true,
          sources: [trimmed],
        });
      }
      return next;
    });
  }, []);

  // remove source
  const removeSource = useCallback((directive: string, source: string) => {
    setPolicy((prev) => {
      const next = new Map(prev);
      const current = next.get(directive);
      if (current) {
        const newSources = current.sources.filter((s) => s !== source);
        next.set(directive, {
          ...current,
          sources: newSources,
          enabled: newSources.length > 0,
        });
      }
      return next;
    });
  }, []);

  // toggle boolean directives like upgrade-insecure-requestr
  const toggleBooleanDirective = useCallback((directive: string) => {
    setBooleanDirectives((prev) => {
      const next = new Set(prev);
      if (next.has(directive)) {
        next.delete(directive);
      } else {
        next.add(directive);
      }
      return next;
    });
  }, []);

  // clear all directives
  const clearAll = useCallback(() => {
    setPolicy(new Map());
    setBooleanDirectives(new Set());
  }, []);

  // apply preset
  const applyPreset = useCallback((preset: PolicyPreset) => {
    const presetConfig = POLICY_PRESET[preset];
    const newPolicy = new Map<string, DirectiveState>();

    // CSP_DIRECTIVES.forEach(d => {
    //   if(d.boolean !== true) {
    //     const directiveSources = (presetConfig.directives as unknown as Record<string, readonly string[]>)[d.name];
    //     const sources = directiveSources ? [...directiveSources] : [];
    //     newPolicy.set(d.name, {
    //       enabled: sources.length > 0,
    //       sources
    //     })
    //   }
    // })

    Object.entries(presetConfig.directives).forEach(([directive, sources]) => {
      const sourceArray = sources as readonly string[];
      newPolicy.set(directive, {
        enabled: true,
        sources: [...sourceArray],
      });
    });

    setPolicy(newPolicy);
    setBooleanDirectives(new Set());
  }, []);

  // add self to all enabled directives
  const addSelfToAll = useCallback(() => {
    setPolicy((prev) => {
      const next = new Map(prev);
      next.forEach((state, directive) => {
        if (state.enabled && !state.sources.includes("'self'")) {
          next.set(directive, {
            ...state,
            sources: [...state.sources, "'self'"],
          });
        }
      });
      return next;
    });
  }, []);

  // generate CSP string
  const generateCSP = useMemo(() => {
    const parts: string[] = [];

    policy.forEach((state, directive) => {
      if (state.enabled && state.sources.length > 0) {
        parts.push(`${directive} ${state.sources.join(" ")}`);
      }
    });

    booleanDirectives.forEach((directive) => {
      parts.push(directive);
    });

    return parts.join("; ");
  }, [policy, booleanDirectives]);

  // get enabled directive count
  const enabledCount = useMemo(() => {
    let count = 0;
    policy.forEach((state) => {
      if (state.enabled) count++;
    });
    count += booleanDirectives.size;
    return count;
  }, [policy, booleanDirectives]);

  // analyse csp using the same lib used to analyser part of app
  const analysedCSP = useMemo(() => {
    if (!generateCSP || enabledCount === 0) return [];
    return analyse(generateCSP);
  }, [generateCSP, enabledCount]);

  // get csp overview
  const overview = useMemo(() => {
    if (analysedCSP.length === 0) {
      return {
        count: 0,
        uniqueSources: [],
        redFlags: [],
        policyGrade: { score: 0, grade: "-" },
        missingDirectives: IMPORTANT_DIRECTIVES,
      };
    }

    return getCSPOverview(analysedCSP);
  }, [analysedCSP]);

  // build attack surface
  const attackSurface = useMemo(() => {
    if (analysedCSP.length === 0) return [];
    return buildAttackSurface(analysedCSP);
  }, [analysedCSP]);

  // validate sources real time
  const validateSource = useCallback(
    (directive: string, source: string): SourceValidation | null => {
      if (!source.trim()) return null;

      const classifiedArr = classifyCSP([{ directive, sources: [source] }]);
      const classified = classifiedArr[0]?.sources[0];

      if (!classified) return null;

      const rules = getRulesForDirective(directive);
      for (const r of rules) {
        if (r.when(classified)) {
          return {
            level: r.level,
            reason: r.reason,
            recommendation: r.recommendation,
            attackClass: r.attackClass,
          };
        }
      }

      return {
        level: "OK",
        reason: "OK, just be careful who you trust.",
      };
    },
    [],
  );

  // import pre-made csp
  const importCSP = useCallback((cspString: string) => {
    const parsed = parseCSP(cspString);
    const newPolicy = new Map<string, DirectiveState>();

    parsed.forEach(({ directive, sources }) => {
      newPolicy.set(directive, {
        enabled: true,
        sources: [...sources],
      });
    });

    setPolicy(newPolicy);
    setBooleanDirectives(new Set());
  }, []);

  return {
    // states
    policy,
    booleanDirectives,
    reportOnly,
    setReportOnly,

    // actions
    toggleDirective,
    addSource,
    removeSource,
    toggleBooleanDirective,
    clearAll,
    applyPreset,
    addSelfToAll,
    importCSP,

    // computed real-time
    generateCSP,
    enabledCount,

    // analysed stuff
    analysedCSP,
    overview,
    attackSurface,
    validateSource,
    missingDirectives: IMPORTANT_DIRECTIVES,
  };
}

export type usePolicyBuilderReturn = ReturnType<typeof usePolicyBuilder>;
