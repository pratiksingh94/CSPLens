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

export type RuleCheck = {
  when: (src: CSPSource) => boolean;
  level: Level;
  reason: string;
  recommendation?: string;
  references?: {
    label: string;
    url: string;
  };
};

export type evaluatedOutcome = {
  level: Level;
  reason: string;
  recommendation?: string;
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
