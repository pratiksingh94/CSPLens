import { AnalysedRule, MissingDirective, Recommendation, RedFlag } from "@/types";

const getRecommendations = (rules: AnalysedRule[], redFlags: RedFlag[], missingDirectives: MissingDirective[]): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const existingDirectives = new Set(rules.map(r => r.directive));

  if(redFlags.some(f => f.key.includes("unsafe-inline") && f.directives.includes("script-src"))) {
    recommendations.push({
      id: "remove-unsafe-inline-scripts",
      priority: "high",
      category: "security",
      title: "Replace unsafe-inline with nonces",
      description: "'unsafe-inline' completely disables CSP's XSS protection for scripts.",
      action: "Generate a random nonce per request and add it to script tags: <script nonce=\"abc123\">. Then use script-src 'self' 'nonce-abc123'; or use hashes",
      impact: "Prevents XSS attacks from injected inline scripts",
      references: {
        label: "MDN - Using nonces",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#unsafe_inline_script"
      }
    });
  }

    if (redFlags.some(f => f.key.includes("unsafe-eval") && f.directives.includes("script-src"))) {
    recommendations.push({
      id: "remove-unsafe-eval",
      priority: "high",
      category: "security",
      title: "Remove unsafe-eval",
      description: "'unsafe-eval' allows eval(), new Function(), and setTimeout(string) - all XSS vectors.",
      action: "Refactor code to avoid eval(), new Function(), setTimeout with strings. Use JSON.parse for JSON data.",
      impact: "Blocks dynamic code execution attacks",
      references: {
        label: "MDN - unsafe-eval",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#unsafe_eval_expressions"
      }
    });
  }

  if (redFlags.some(f => f.key === "*" && f.directives.includes("script-src"))) {
    recommendations.push({
      id: "remove-wildcard-scripts",
      priority: "high",
      category: "security",
      title: "Remove wildcard from script-src",
      description: "Allowing scripts from any origin enables full supply chain compromise.",
      action: "List specific trusted script hosts or use 'self' with nonces.",
      impact: "Prevents loading malicious scripts from untrusted sources"
    });
  }

  if (!existingDirectives.has("frame-ancestors")) {
    recommendations.push({
      id: "add-frame-ancestors",
      priority: "high",
      category: "security",
      title: "Add frame-ancestors directive",
      description: "Without frame-ancestors, your site can be embedded in iframes for clickjacking.",
      action: "Add frame-ancestors 'self'; or frame-ancestors 'none';",
      impact: "Prevents clickjacking attacks"
    });
  }

  if (!existingDirectives.has("object-src")) {
    recommendations.push({
      id: "add-object-src",
      priority: "high",
      category: "security",
      title: "Add object-src 'none'",
      description: "Without object-src, legacy plugins (Flash, PDF) can execute arbitrary code.",
      action: "Add object-src 'none'; unless you absolutely need plugin content.",
      impact: "Eliminates plugin-based attack vectors"
    });
  }

  // === MEDIUM PRIORITY ===

  if (!existingDirectives.has("default-src")) {
    recommendations.push({
      id: "add-default-src",
      priority: "medium",
      category: "best-practice",
      title: "Add default-src fallback",
      description: "Without default-src, browsers may allow resources from any origin for undefined directives.",
      action: "Add default-src 'self'; or default-src 'none'; with explicit directives.",
      impact: "Provides defense-in-depth for future directives"
    });
  }


  if (!existingDirectives.has("base-uri")) {
    recommendations.push({
      id: "add-base-uri",
      priority: "medium",
      category: "security",
      title: "Add base-uri directive",
      description: "Attackers can inject <base> tags to hijack relative URLs.",
      action: "Add base-uri 'self'; or base-uri 'none';",
      impact: "Prevents base tag injection attacks"
    });
  }


  if (!existingDirectives.has("form-action")) {
    recommendations.push({
      id: "add-form-action",
      priority: "medium",
      category: "security",
      title: "Add form-action directive",
      description: "Without form-action, forms can submit to attacker-controlled endpoints.",
      action: "Add form-action 'self'; to restrict form submissions.",
      impact: "Prevents credential/data exfiltration via forms"
    });
  }


  if (redFlags.some(f => f.key.includes("unsafe-inline") && f.directives.includes("style-src"))) {
    recommendations.push({
      id: "remove-unsafe-inline-styles",
      priority: "medium",
      category: "security",
      title: "Consider removing unsafe-inline from style-src",
      description: "Inline styles can be abused for UI redressing attacks, though less critical than scripts.",
      action: "Move inline styles to external stylesheets or use nonces/hashes.",
      impact: "Reduces UI manipulation attack surface"
    });
  }

  // === LOW PRIORITY ===


  if (!existingDirectives.has("upgrade-insecure-requests")) {
    recommendations.push({
      id: "add-upgrade-insecure-requests",
      priority: "low",
      category: "best-practice",
      title: "Add upgrade-insecure-requests",
      description: "Automatically upgrades HTTP requests to HTTPS.",
      action: "Add upgrade-insecure-requests; for HTTPS sites.",
      impact: "Prevents mixed content issues"
    });
  }


  if (!existingDirectives.has("report-uri") && !existingDirectives.has("report-to")) {
    recommendations.push({
      id: "add-csp-reporting",
      priority: "low",
      category: "best-practice",
      title: "Add CSP violation reporting",
      description: "Without reporting, you can't detect CSP violations or attacks.",
      action: "Add report-uri /csp-report; and/or report-to csp-endpoint;",
      impact: "Enables security monitoring and debugging",
      references: {
        label: "MDN - CSP Reporting",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#enabling_reporting"
      }
    });
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}


export default getRecommendations;