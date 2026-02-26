import { MissingDirective } from "@/types";


// i dont think i need the contextual ones cuz they, well, depend on the website's context lmao
const IMPORTANT_DIRECTIVES: MissingDirective[] = [
  {
    directive: "default-src",
    importanceLevel: "important",
    importance: "Acts as a fallback for all other resource types and prevents accidental loading from untrusted origins.",
    recommendation: "Always define a restrictive default policy to reduce the overall attack surface.",
    recommendedRule: "default-src 'self';",
    references: {
      label: "MDN - default-src",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src"
    }
  },
  {
    directive: "script-src",
    importanceLevel: "critical",
    importance: "Scripts are the primary vector for XSS attacks and full client-side compromise.",
    attackClass: "XSS",
    recommendation: "Explicitly restrict script sources and avoid unsafe-inline where possible.",
    recommendedRule: "script-src 'self';",
    references: {
      label: "MDN - script-src",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src"
    }
  },
  {
    directive: "object-src",
    importanceLevel: "critical",
    importance: "Prevents execution of legacy plugins that are commonly abused or deprecated.",
    attackClass: "SANDBOX_ESCAPE",
    recommendation: "Disable all object-based resources unless absolutely required.",
    recommendedRule: "object-src 'none';",
    references: {
      label: "MDN - object-src",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/object-src"
    }
  },
  {
    directive: "base-uri",
    importanceLevel: "important",
    importance: "Stops attackers from redefining the base URL to hijack relative links.",
    recommendation: "Restrict base URIs to trusted origins only.",
    attackClass: "XSS",
    recommendedRule: "base-uri 'self';",
    references: {
      label: "MDN - base-uri",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/base-uri"
    }
  },
  {
    directive: "frame-ancestors",
    importanceLevel: "critical",
    importance: "Prevents clickjacking by disallowing your site from being embedded in malicious iframes.",
    recommendation: "Explicitly define which origins, if any, may embed your site.",
    recommendedRule: "frame-ancestors 'none';",
    attackClass: "CLICKJACKING",
    references: {
      label: "MDN - frame-ancestors",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors"
    }
  },
  {
    directive: "form-action",
    importanceLevel: "important",
    importance: "Prevents sensitive form data from being submitted to attacker-controlled endpoints.",
    recommendation: "Restrict form submissions to trusted origins only.",
    recommendedRule: "form-action 'self';",
    references: {
      label: "MDN - form-action",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/form-action"
    }
  },
  {
    directive: "upgrade-insecure-requests",
    importanceLevel: "optional",
    importance: "Automatically upgrades HTTP requests to HTTPS, preventing mixed content.",
    recommendation: "Highly recommended for HTTPS sites to ensure all resources use secure connections.",
    recommendedRule: "upgrade-insecure-requests;",
    references: {
      label: "MDN - upgrade-insecure-requests",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests"
    }
  }
];

// directives that are nice to have but won't affect score
const NICE_TO_HAVE: MissingDirective[] = [
  {
    directive: "report-uri",
    importanceLevel: "optional",
    importance: "Enables CSP violation reporting for monitoring and debugging.",
    recommendation: "Set up a reporting endpoint to catch CSP violations.",
    recommendedRule: "report-uri /csp-report;",
    references: {
      label: "MDN - report-uri",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri"
    }
  },
  {
    directive: "report-to",
    importanceLevel: "optional",
    importance: "Modern CSP reporting using the Reporting API.",
    recommendation: "Use together with report-uri for browser compatibility.",
    recommendedRule: "report-to csp-endpoint;",
    references: {
      label: "MDN - report-to",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to"
    }
  },
];

export default IMPORTANT_DIRECTIVES;
export { NICE_TO_HAVE };