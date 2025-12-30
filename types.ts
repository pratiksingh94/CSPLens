export type Level = | "GOOD" | "OK" | "WARNING" | "DANGER" | "INVALID";



export type CSPSource = 
    | { kind: "keyword", value: string }
    | { kind: "scheme", value: string }
    | { kind: "host", value: string }
    | { kind: "wildcard", value: string }
    | { kind: "nonce", value: string };

export type AnalysedCSPSource = {
    source: CSPSource,
    level: Level
};


export type Rule<TSource> = {
    directive: string,
    sources: TSource[]
};

export type ParsedRule = Rule<string>;
export type ClassifiedRule = Rule<CSPSource>;
export type AnalysedRule = Rule<AnalysedCSPSource>;


export type RuleCheck = {
    when: (src: CSPSource) => boolean;
    level: Level;
}