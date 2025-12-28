import { RuleCheck } from "@/types";

const GLOBAL_RULES: RuleCheck[] = [
    {
        when: src => src.kind === "wildcard",
        level: "DANGER"
    },
    {
        when: src => src.kind === "keyword" && src.value === "unsafe-eval",
        level: "DANGER"
    },
    {
        when: src => src.kind === "keyword" && src.value === "unsafe-inline",
        level: "DANGER"
    },
    {
        when: src => src.kind === "keyword" && src.value === "self",
        level: "GOOD"
    },
    {
        when: src => src.kind === "keyword" && src.value === "none",
        level: "GOOD"
    },
    {
        when: src => src.kind === "nonce",
        level: "GOOD"
    },
]

const DIRECTIVE_RULES: Record<string, RuleCheck[]> = {
    "script-src": [
        {
            when: src => src.kind === "scheme" && src.value === "data:",
            level: "DANGER"
        },
        {
            when: src => src.kind === "scheme" && src.value === "blob:",
            level: "WARNING"
        },
        {
            when: src => src.kind === "host" && src.value.includes("*"),
            level: "DANGER"
        }
    ],
    "style-src": [
        {
            when: src => src.kind === "keyword" && src.value === "unsafe-eval",
            level: "INVALID"
        },
        {
            when: src => src.kind === "keyword" && src.value === "unsafe-inline",
            level: "DANGER"
        },
        {
            when: src => src.kind === "scheme" && src.value === "data:",
            level: "WARNING"
        },
        {
            when: src => src.kind === "host" && src.value.includes("*"),
            level: "WARNING"
        },
    ],
    "img-src": [
        {
            when: src => src.kind === "scheme" && src.value === "data:",
            level: "WARNING"
        },
        {
            when: src => src.kind === "wildcard",
            level: "DANGER"
        },
    ],
    "connect-src": [
        {
            when: src => src.kind === "host",
            level: "WARNING"
        }
    ]
}


export const getRulesForDirective= (directive: string): RuleCheck[] => {
    return [
        ...(DIRECTIVE_RULES[directive] ?? []),
        ...GLOBAL_RULES
    ]
}