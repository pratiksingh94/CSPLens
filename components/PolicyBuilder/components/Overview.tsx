"use client";

import { cn } from "@/lib/utils";
import {
  AttackSurfaceItem,
} from "@/types";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Shield,
  XCircle,
} from "lucide-react";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { useState } from "react";
import { usePolicyBuilderReturn } from "../hooks/usePolicyBuilder";

type ScoreFactor = {
  type: "penalty" | "bonus";
  amount: number;
  reason: string;
};

type PolicyGradeResult = {
  score: number;
  grade: string;
  cappedBy: string | undefined;
  factors: ScoreFactor[];
};

type Props = {
  overview: usePolicyBuilderReturn["overview"];
  generateCSP: string;
  reportOnly: boolean;
  setReportOnly: (val: boolean) => void;
  attackSurface: AttackSurfaceItem[];
};

export function Overivew({
  overview,
  generateCSP,
  reportOnly,
  setReportOnly,
  attackSurface,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!generateCSP) return;
    await navigator.clipboard.writeText(generateCSP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A") return "text-emerald-500";
    if (grade === "B") return "text-primary";
    if (grade === "C") return "text-warning";
    if (grade === "D") return "text-orange-500";
    return "text-destructive";
  };

  const getGradeBg = (grade: string) => {
    if (grade === "A") return "bg-emerald-500/20";
    if (grade === "B") return "bg-primary/20";
    if (grade === "C") return "bg-warning/20";
    if (grade === "D") return "bg-orange-500/20";
    return "bg-destructive/20";
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* SCORE CARD  */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative w-20 h-20 rounded-full flex items-center justify-center shrink-0",
              getGradeBg(overview.policyGrade.grade),
            )}
          >
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/30"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={cn(
                  "transition-all duration-500",
                  getGradeColor(overview.policyGrade.grade),
                )}
                strokeDasharray={`${overview.policyGrade.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={cn(
                  "text-2xl font-bold",
                  getGradeColor(overview.policyGrade.grade),
                )}
              >
                {overview.policyGrade.grade}
              </span>
              <span className="text-xs text-muted-foreground">
                {overview.policyGrade.score}%
              </span>
            </div>
          </div>

          {/* SCORE INFO  */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield
                className={cn(
                  "h-5 w-5",
                  getGradeColor(overview.policyGrade.grade),
                )}
              />
              <span className="font-semibold">Security Score</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {overview.policyGrade.score >= 90
                ? "Execellent! Your policy follows best security pratices."
                : overview.policyGrade.score >= 70
                  ? "Good, but there are improvements to consider."
                  : overview.policyGrade.score >= 50
                    ? "Moderate risk. Review the issues below."
                    : "High risk! Your policy needs significant improvements."}
            </p>
          </div>
        </div>
      </div>

      {/* GENERATED CSP  */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
          <span className="font-medium text-sm">Generated CSP</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <span>Report-Only</span>
              <Switch
                checked={reportOnly}
                onCheckedChange={setReportOnly}
                className="scale-75"
              />
            </label>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <code className="block font-mono text-sm break-all leading-relaxed">
            {reportOnly
              ? "Content-Security-Policy-Report-Only: "
              : "Content-Security-Policy: "}
            {generateCSP}
          </code>
        </div>
      </div>

      {/* RED FLAGS 💅 */}
      {overview.redFlags.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="font-semibold text-sm text-destructive">
              Red Flags ({overview.redFlags.length})
            </span>
          </div>
          <div className="space-y-3">
            {overview.redFlags.map((flag) => (
              <div
                key={flag.key}
                className="p-3 rounded-md bg-card border border-border"
              >
                <div className="flex items-start gap-3">
                  <code className="px-2 py-0.5 bg-destructive/10 text-destructive rounded text=xs font-mono shrink-0">
                    {flag.key}
                  </code>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{flag.reason}</p>
                    {flag.recommendation && (
                      <p className="text-sm text-primary mt-1">
                        {flag.recommendation}
                      </p>
                    )}
                    {flag.references && (
                      <a
                        href={flag.references.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                      >
                        {flag.references.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Affected:
                      </span>
                      {flag.directives.map((d) => (
                        <code
                          key={d}
                          className="px-1.5 py-0.5 bg-muted rounded text-xs"
                        >
                          {d}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MISSING DIRECTIVES  */}
      {overview.missingDirectives.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-warning" />
            <span className="font-semibold text-sm text-warning">
              Missing Directives ({overview.missingDirectives.length})
            </span>
          </div>

          <div className="space-y-3">
            {overview.missingDirectives.map((missing) => (
              <div
                key={missing.directive}
                className="p-3 rounded-md bg-card border border-border"
              >
                <div className="flex items-start gap-3">
                  <code className="px-2 py-0.5 bg-warning/10 text-warning rounded text-xs font-mono shrink-0">
                    {missing.directive}
                  </code>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {missing.importance}
                    </p>
                    {missing.recommendation && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {missing.recommendation}
                      </p>
                    )}
                    {missing.recommendedRule && (
                      <code className="block mt-2 px-2 py-1.5 bg-muted rounded text-xs font-mono">
                        {missing.recommendedRule}
                      </code>
                    )}
                    {missing.references && (
                      <a
                        href={missing.references.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                      >
                        {missing.references.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATTACK SURFACE  */}
      {attackSurface.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="font-semibold text-sm">
              Potential Attack Vectors
            </span>
          </div>
          <div className="space-y-3">
            {attackSurface.map((atk) => (
              <div key={atk.id} className="p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      atk.severity === "HIGH"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-warning/20 text-warning",
                    )}
                  >
                    {atk.severity}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {atk.title}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{atk.impact}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {atk.causes.map((c, i) => (
                    <code
                      key={i}
                      className="px-1.5 py-0.5 bg-muted rounded text-xs"
                    >
                      {c.directive}: {c.source}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
