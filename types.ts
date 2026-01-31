export type Level = "GOOD" | "OK" | "WARNING" | "DANGER" | "INVALID";

export type CSPSource =
  | { kind: "keyword"; value: string }
  | { kind: "scheme"; value: string }
  | { kind: "host"; value: string }
  | { kind: "wildcard"; value: string }
  | { kind: "nonce"; value: string };

export type AnalysedCSPSource = {
  source: CSPSource;
  level: Level;
  reason: string;
  recommendation?: string;
  attackClass?: AttackClass;
  references?: {
    label: string;
    url: string;
  };
};

export type Rule<TSource> = {
  directive: string;
  sources: TSource[];
};

export type ParsedRule = Rule<string>;
export type ClassifiedRule = Rule<CSPSource>;
export type AnalysedRule = Rule<AnalysedCSPSource>;

export type AttackClass =
  | "XSS"
  | "DYNAMIC_CODE_EXECUTION"
  | "CLICKJACKING"
  | "DATA_EXFILTRATION"
  | "UI_REDRESS"
  | "TRACKING"
  | "SUPPLY_CHAIN"
  | "SANDBOX_ESCAPE";

export type RuleCheck = {
  when: (src: CSPSource) => boolean;
  level: Level;
  reason: string;
  recommendation?: string;
  attackClass?: AttackClass;
  references?: {
    label: string;
    url: string;
  };
};

export type evaluatedOutcome = {
  level: Level;
  reason: string;
  recommendation?: string;
  attackClass?: AttackClass;
  references?: {
    label: string;
    url: string;
  };
};

export type RedFlag = {
  key: string;
  level: "DANGER";
  reason: string;
  recommendation?: string;
  references?: {
    label: string;
    url: string;
  };
  directives: string[];
  count: number;
};

export type MissingDirective = {
  directive: string;
  importance: string;
  attackClass?: AttackClass;
  recommendation: string;
  recommendedRule: string;
  references?: {
    label: string;
    url: string;
  };
};


export type AttackSurfaceItem = {
  id: string;
  title: string;
  severity: "HIGH" | "MEDIUM";
  causes: {
    directive: string;
    source: string; // just one word that i can get from analysed source
  }[];
  impact: string;
}

export type ExportMeta = {
  tool: "CSPLens - https://csplens.pratiksingh.xyz";
  generatedAt: string;
  input: {
    source: "direct-header" | "fetched-url";
    url?: string;
    reportOnly: boolean;
  }
}

export type ExportOverview = {
  policyGrade: {
    grade: string;
    score: number;
    cappedBy?: string;
  };
  summary: {
    directivesPresent: number;
    missingCritical: number;
    redFlagCount: number;
  }
}

export type ExportData = {
  meta: ExportMeta;
  overview: ExportOverview;
  attackSurface: AttackSurfaceItem[];
  findings: {
    missingDirectives: MissingDirective[];
    redFlags: RedFlag[]
  };
  policy: AnalysedRule[]
}