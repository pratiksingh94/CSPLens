import { RuleCheck } from "@/types";

// TODO: THINK OF A BETTER WAY TO HANDLE AND STORE THIS AND ADD REST OF THE RULES FOR NOW
// just works rn lmao

const GLOBAL_RULES: RuleCheck[] = [
  {
    when: (src) => src.kind === "wildcard",
    level: "DANGER",
    reason:
      "Allows resources from any origin, completely bypassing CSP protection and enabling XSS via third-party injection.",
    recommendation:
      "Replace '*' with explicit trusted origins or restrict to 'self' wherever possible.",

    references: {
      label: "MDN - CSP host source",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy#host-source",
    },
  },
  {
    when: (src) => src.kind === "keyword" && src.value === "unsafe-eval",
    level: "DANGER",
    reason:
      "Enables eval-like functions, which attackers can abuse to execute arbitrary JavaScript after an XSS.",
    recommendation:
      "Remove unsafe-eval and refactor code to avoid eval(), new Function() or similar dynamic execution.",
    references: {
      label: "MDN - unsafe-eval",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src#unsafe_eval_expressions",
    },
  },
  {
    when: (src) => src.kind === "keyword" && src.value === "unsafe-inline",
    level: "DANGER",
    reason:
      "Disables CSP's main protection by allowing inline scripts and event handlers, making XSS trivial.",
    recommendation:
      "Remove unsafe-inline and use nonces or hashes to allow only explicitly trusted inline code.",
    references: {
      label: "MDN - CSP unsafe-inline",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy#unsafe-inline",
    },
  },
  {
    when: (src) => src.kind === "keyword" && src.value === "self",
    level: "GOOD",
    reason:
      "Restricts resources to the same origin, significantly reducing third-party injection risk.",
  },
  {
    when: (src) => src.kind === "keyword" && src.value === "none",
    level: "GOOD",
    reason:
      "Blocks all sources for this directive, providing maximum restriction.",
  },
  {
    when: (src) => src.kind === "nonce",
    level: "GOOD",
    reason:
      "Allows only explicitly trusted inline scripts via a per-request nonce, THE recommended CSP approach.",
  },
];

const DIRECTIVE_RULES: Record<string, RuleCheck[]> = {
  "script-src": [
    {
      when: (src) => src.kind === "scheme" && src.value === "data:",
      level: "DANGER",
      reason:
        "Allows execution of JavaScript embedded in data URLs, enabling XSS even without external scripts.",
      recommendation:
        "remove data: from script-src. Inline scripts should be controlle using nonces or hashes instead",
      references: {
        label: "MDN - script-src",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src",
      },
    },
    {
      when: (src) => src.kind === "scheme" && src.value === "blob:",
      level: "WARNING",
      reason:
        "Blob URLs can be abused if attacker-controlled data is converted into executable scripts.",
      recommendation:
        "Avoid blob: in script-src unless required by a trusted framework, and ensure blob URLs are never attacker-controlled.",
      references: {
        label: "MDN - script-src",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src",
      },
    },
    {
      when: (src) => src.kind === "host" && src.value.includes("*"),
      level: "DANGER",
      reason:
        "Allowing scripts from anywhere can result in remote code execution.",
      recommendation:
        "Remove '*' from script-src. Scripts are meant to be controlled using nonces and hashes.",
      references: {
        label: "MDN - host source",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy#host-source",
      },
    },
  ],
  "style-src": [
    {
      when: (src) => src.kind === "keyword" && src.value === "unsafe-eval",
      level: "INVALID",
      reason: "Doesn't belong here, there is no eval function in style.",
    },
    {
      when: (src) => src.kind === "keyword" && src.value === "unsafe-inline",
      level: "DANGER",
      reason:
        "Allows inline styles, which can be abused for UI redressing, clickjacking, and data exfiltration via CSS.",
      recommendation:
        "Move inline styles to external stylesheets or use CSP hashes for critical inline styles",
      references: {
        label: "MDN - unsafe-inline",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy#unsafe-inline",
      },
    },
    {
      when: (src) => src.kind === "scheme" && src.value === "data:",
      level: "WARNING",
      reason:
        "Allows CSS from data URLs, increasing attack surface if user input reaches style contexts.",
      recommendation:
        "Avoid data: in style-src where possible. Use external stylesheets or CSP hashes instead.",
      references: {
        label: "MDN - style-src",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src",
      },
    },
    {
      when: (src) => src.kind === "host" && src.value.includes("*"),
      level: "WARNING",
      reason:
        "Allows CSS from arbitrary origins, enabling UI manipulation, clickjacking, and limited data exfiltration via CSS.",
      recommendation:
        "Replace wildcard subdomains with explicit, trusted style hosts or restrict to 'self' where possible.",
      references: {
        label: "MDN - host source",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy#host-source",
      },
    },
  ],
  "img-src": [
    {
      when: (src) => src.kind === "scheme" && src.value === "data:",
      level: "WARNING",
      reason: "Allows images from data URLs, which can include SVGs capable of script execution and be abused in XSS chains.",
      recommendation:
        "Allow data: only if SVG images are sanitized or disabled. Prefer hosting images on trusted origins.",
      references: {
        label: "MDN - img-src",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/img-src",
      },
    },
    // {
    //   when: (src) => src.kind === "wildcard",
    //   level: "DANGER",
    //   reason:
    //     "Allows images from any origin, enabling SVG-based XSS, tracking beacons, and data exfiltration.",
    // },
  ],
  "connect-src": [
    {
      when: (src) => src.kind === "host",
      level: "WARNING",
      reason:
        "Allows outbound network requests; if compromised, attackers can exfiltrate sensitive data via fetch or WebSockets.",
      recommendation:
        "Restrict connect-src to required API and WebSocket endpoints instead of broad or unnecessary external hosts.",
      references: {
        label: "MDN - host source",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy#host-source",
      },
    },
  ],
};

export const getRulesForDirective = (directive: string): RuleCheck[] => {
  return [...(DIRECTIVE_RULES[directive] ?? []), ...GLOBAL_RULES];
};
