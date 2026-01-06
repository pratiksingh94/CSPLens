import { AnalysedRule, AttackClass, AttackSurfaceItem } from "@/types";


const attackClassTitle: Record<AttackClass, string> = {
    XSS: "Arbitrary Script Execution (Cross Site Scripting)",
    DYNAMIC_CODE_EXECUTION: "Dynamic JavaScript Execution",
    CLICKJACKING: "Clickjacking via Frame Embedding",
    UI_REDRESS: "UI Redressing & Visual Manipulation",
    DATA_EXFILTRATION: "Client-side Data Exfiltration",
    SUPPLY_CHAIN: "Third-party Supply Chain Risk",
    TRACKING: "Cross-Origin Tracking & Beacons",
    SANDBOX_ESCAPE: "Sandbox / Execution Boundary Escape"
}

export const attackClassImpact: Record<AttackClass, string> = {
  XSS:
    "Allows attackers to execute arbitrary JavaScript, leading to account takeover, session hijacking, and data theft.",

  DYNAMIC_CODE_EXECUTION:
    "Enables execution of dynamically constructed JavaScript, significantly amplifying the impact of injection vulnerabilities.",

  CLICKJACKING:
    "Allows the application to be embedded in iframes, enabling UI deception attacks that trick users into performing unintended actions.",

  UI_REDRESS:
    "Allows visual manipulation of the interface, enabling clickjacking-style attacks, phishing overlays, and limited data leakage via CSS.",

  DATA_EXFILTRATION:
    "Allows compromised client-side code to transmit sensitive data to attacker-controlled endpoints.",

  SUPPLY_CHAIN:
    "Introduces risk from third-party resources, where compromise of an external dependency can lead to full client-side takeover.",

  TRACKING:
    "Enables cross-origin tracking, user fingerprinting, and privacy-invasive data collection.",

  SANDBOX_ESCAPE:
    "Allows attackers to escape intended execution boundaries using blob or data URLs, potentially chaining into script execution.",
};


const buildAttackSurface = (analysed: AnalysedRule[]): AttackSurfaceItem[] => {
    const map = new Map<string, AttackSurfaceItem>();

    for(const rule of analysed) {
        for(const src of rule.sources) {
            if(!src.attackClass || (src.level !== "DANGER" && src.level !== "WARNING")) continue;

            const key = src.attackClass;

            if(!map.has(key)) {
                map.set(key, {
                    id: key,
                    title: attackClassTitle[key],
                    severity: src.level === "DANGER" ? "HIGH" : "MEDIUM",
                    impact: attackClassImpact[key],
                    causes: []
                })
            }

            map.get(key)!.causes.push({
                directive: rule.directive,
                source: src.source.value
            })
        }
    }

    return [...map.values()]
}

export default buildAttackSurface;