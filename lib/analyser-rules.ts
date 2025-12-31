import { RuleCheck } from "@/types";

const GLOBAL_RULES: RuleCheck[] = [
    {
        when: src => src.kind === "wildcard",
        level: "DANGER",
        reason: "hi"
    },
    {
        when: src => src.kind === "keyword" && src.value === "unsafe-eval",
        level: "DANGER",
        reason: "hi"
    },
    {
        when: src => src.kind === "keyword" && src.value === "unsafe-inline",
        level: "DANGER",
        reason: "hi"
    },
    {
        when: src => src.kind === "keyword" && src.value === "self",
        level: "GOOD",
        reason: "hi"
    },
    {
        when: src => src.kind === "keyword" && src.value === "none",
        level: "GOOD",
        reason: "hi"
    },
    {
        when: src => src.kind === "nonce",
        level: "GOOD",
        reason: "hi"
    },
]

const DIRECTIVE_RULES: Record<string, RuleCheck[]> = {
    "script-src": [
        {
            when: src => src.kind === "scheme" && src.value === "data:",
            level: "DANGER",
            reason: "hi"
        },
        {
            when: src => src.kind === "scheme" && src.value === "blob:",
            level: "WARNING",
            reason: "hi"
        },
        {
            when: src => src.kind === "host" && src.value.includes("*"),
            level: "DANGER",
            reason: "hi"
        }
    ],
    "style-src": [
        {
            when: src => src.kind === "keyword" && src.value === "unsafe-eval",
            level: "INVALID",
            reason: "hi"
        },
        {
            when: src => src.kind === "keyword" && src.value === "unsafe-inline",
            level: "DANGER",
            reason: "hi"
        },
        {
            when: src => src.kind === "scheme" && src.value === "data:",
            level: "WARNING",
            reason: "hi"
        },
        {
            when: src => src.kind === "host" && src.value.includes("*"),
            level: "WARNING",
            reason: "hi"
        },
    ],
    "img-src": [
        {
            when: src => src.kind === "scheme" && src.value === "data:",
            level: "WARNING",
            reason: "hi"
        },
        {
            when: src => src.kind === "wildcard",
            level: "DANGER",
            reason: "hi"
        },
    ],
    "connect-src": [
        {
            when: src => src.kind === "host",
            level: "WARNING",
            reason: "hi"
        }
    ]
}


export const getRulesForDirective= (directive: string): RuleCheck[] => {
    return [
        ...(DIRECTIVE_RULES[directive] ?? []),
        ...GLOBAL_RULES
    ]
}