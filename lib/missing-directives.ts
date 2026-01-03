import { MissingDirective } from "@/types";


// i dont think i need the contextual ones cuz they, well, depend on the website's context lmao
const IMPORTANT_DIRECTIVES: MissingDirective[] = [
  {
    directive: "default-src",
    importance: "Acts as a fallback for all other resource types and prevents accidental loading from untrusted origins.",
    recommendation: "Always define a restrictive default policy to reduce the overall attack surface.",
    recommendedRule: "default-src 'self';",
    references: {
      label: "MDN: default-src",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src"
    }
  },
  {
    directive: "script-src",
    importance: "Scripts are the primary vector for XSS attacks and full client-side compromise.",
    recommendation: "Explicitly restrict script sources and avoid unsafe-inline where possible.",
    recommendedRule: "script-src 'self';",
    references: {
      label: "MDN: script-src",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src"
    }
  },
  {
    directive: "object-src",
    importance: "Prevents execution of legacy plugins that are commonly abused or deprecated.",
    recommendation: "Disable all object-based resources unless absolutely required.",
    recommendedRule: "object-src 'none';",
    references: {
      label: "MDN: object-src",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/object-src"
    }
  },
  {
    directive: "base-uri",
    importance: "Stops attackers from redefining the base URL to hijack relative links.",
    recommendation: "Restrict base URIs to trusted origins only.",
    recommendedRule: "base-uri 'self';",
    references: {
      label: "MDN: base-uri",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/base-uri"
    }
  },
  {
    directive: "frame-ancestors",
    importance: "Prevents clickjacking by disallowing your site from being embedded in malicious iframes.",
    recommendation: "Explicitly define which origins, if any, may embed your site.",
    recommendedRule: "frame-ancestors 'none';",
    references: {
      label: "MDN: frame-ancestors",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors"
    }
  },
  {
    directive: "form-action",
    importance: "Prevents sensitive form data from being submitted to attacker-controlled endpoints.",
    recommendation: "Restrict form submissions to trusted origins only.",
    recommendedRule: "form-action 'self';",
    references: {
      label: "MDN: form-action",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/form-action"
    }
  }
];



export default IMPORTANT_DIRECTIVES