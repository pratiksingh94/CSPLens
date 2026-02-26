"use client";

import getCSPOverview from "@/lib/csp-overview";
import { AnalysedRule } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import MissingDirectives from "./MissingDirectives";
import levelClasses from "@/lib/level-classes";
import { Badge } from "@/components/ui/badge";
import getRecommendations from "@/lib/recommendations";
import { useState } from "react";
import { AlertTriangle, ArrowUpRight, Check, ChevronDown, ChevronUp, ExternalLink, Lightbulb, Shield, TrendingDown, TrendingUp } from "lucide-react";


type Props = {
  data: AnalysedRule[];
};

export default function CSPOverview({ data }: Props) {
  const [showFactors, setShowFactors] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const overview = getCSPOverview(data);
  const recommendations = getRecommendations(data, overview.redFlags, overview.missingDirectives);

  const getGradeColor = (grade: string) => {
    if (grade === "A") return "text-emerald-500";
    if (grade === "B") return "text-primary";
    if (grade === "C") return "text-warning";
    if (grade === "D") return "text-orange-500";
    return "text-destructive";
  };

  const getGradeBg = (grade: string) => {
    if (grade === "A") return "bg-emerald-500/20 border-emerald-500/30";
    if (grade === "B") return "bg-primary/20 border-primary/30";
    if (grade === "C") return "bg-warning/20 border-warning/30";
    if (grade === "D") return "bg-orange-500/20 border-orange-500/30";
    return "bg-destructive/20 border-destructive/30";
  };

  const penalties = overview.policyGrade.factors?.filter(f => f.type === "penalty") || [];
  const bonuses = overview.policyGrade.factors?.filter(f => f.type === "bonus") || [];


  return (
    <div className="mt-4 space-y-4">
      {/* POLICY GRADE*/}
      <section className={cn(
        "rounded-lg border p-4",
        getGradeBg(overview.policyGrade.grade)
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center shrink-0",
            "bg-background/50"
          )}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/30"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={cn("transition-all duration-500", getGradeColor(overview.policyGrade.grade))}
                strokeDasharray={`${overview.policyGrade.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span className={cn("absolute text-xl font-bold", getGradeColor(overview.policyGrade.grade))}>
              {overview.policyGrade.grade}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Shield className={cn("h-5 w-5", getGradeColor(overview.policyGrade.grade))} />
              <span className="font-semibold">Security Score</span>
              <span className={cn("text-xl font-bold ml-auto", getGradeColor(overview.policyGrade.grade))}>
                {overview.policyGrade.score}%
              </span>
            </div>
            {overview.policyGrade.cappedBy && (
              <p className="text-sm text-destructive mt-1">
                ⚠️ Capped: {overview.policyGrade.cappedBy}
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="font-semibold text-foreground">{overview.count}</div>
              <div>Directives</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="font-semibold text-destructive">{overview.redFlags.length}</div>
              <div>Red Flags</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="font-semibold text-warning">{overview.missingDirectives.length}</div>
              <div>Missing</div>
            </div>
          </div>
        </div>

        {/* SCORING breakdown */}
        {(penalties.length > 0 || bonuses.length > 0) && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <button
              onClick={() => setShowFactors(!showFactors)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showFactors ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              Show scoring breakdown
              <span className="text-destructive">-{penalties.reduce((sum, p) => sum + p.amount, 0)}</span>
              <span className="text-emerald-500">+{bonuses.reduce((sum, b) => sum + b.amount, 0)}</span>
            </button>

            {showFactors && (
              <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                {penalties.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 font-medium text-destructive mb-2">
                      <TrendingDown className="h-3 w-3" /> Penalties
                    </div>
                    <ul className="space-y-1">
                      {penalties.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-destructive/70">-{p.amount}</span>
                          <span className="text-muted-foreground">{p.reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {bonuses.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 font-medium text-emerald-500 mb-2">
                      <TrendingUp className="h-3 w-3" /> Bonuses
                    </div>
                    <ul className="space-y-1">
                      {bonuses.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500/70">+{b.amount}</span>
                          <span className="text-muted-foreground">{b.reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* MISSING DIRECTIVES */}
      {overview.missingDirectives.length > 0 && (
        <section className="rounded-lg border border-warning/30 bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="font-medium text-warning">
              Missing Important Directives ({overview.missingDirectives.length})
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {overview.missingDirectives.map((d) => (
              <div key={d.directive} className="group relative">
                <code 
                  className={cn(
                    "px-2 py-1 rounded text-sm font-mono cursor-help",
                    d.importanceLevel === "critical" 
                      ? "bg-destructive/10 text-destructive"
                      : d.importanceLevel === "important"
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {d.directive}
                  {d.importanceLevel === "critical" && <span className="ml-1 text-[10px]">!</span>}
                </code>
                
                <div className="absolute left-0 top-full mt-2 z-10 w-72 p-3 rounded-lg bg-card border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded",
                      d.importanceLevel === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                    )}>
                      {d.importanceLevel}
                    </span>
                    {d.attackClass && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded">
                        {d.attackClass}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{d.importance}</p>
                  {d.recommendedRule && (
                    <code className="block mt-2 px-2 py-1 bg-muted rounded text-xs">
                      {d.recommendedRule}
                    </code>
                  )}
                  {d.references && (
                    <a
                      href={d.references.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {d.references.label} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RED FLAGS */}
      {overview.redFlags.length > 0 && (
        <section className="rounded-lg border border-destructive/30 bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="font-medium text-destructive">
              Red Flags ({overview.redFlags.length})
            </h3>
          </div>

          <div className="space-y-3">
            {overview.redFlags.map((flag) => (
              <div
                key={flag.key}
                className="p-3 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-start gap-3">
                  <code className="px-2 py-0.5 bg-destructive/10 text-destructive rounded text-xs font-mono shrink-0">
                    {flag.key}
                  </code>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{flag.reason}</p>
                    
                    {flag.recommendation && (
                      <p className="text-xs text-primary mt-1">
                        Fix: {flag.recommendation}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {flag.directives.map((d) => (
                        <code key={d} className="px-1 py-0.5 bg-muted rounded text-[10px]">
                          {d}
                        </code>
                      ))}
                      {flag.references && (
                        <a
                          href={flag.references.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Docs <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {overview.redFlags.length === 0 && overview.missingDirectives.length === 0 && overview.policyGrade.score >= 90 && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="font-medium text-emerald-600">No critical issues detected!</p>
            <p className="text-sm text-emerald-600/70">Your CSP policy looks good.</p>
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-4">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="flex items-center justify-between w-full cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h3 className="font-medium">
                Recommendations ({recommendations.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {recommendations.filter(r => r.priority === "high").length} high priority
              </span>
              {showRecommendations ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {showRecommendations && (
            <div className="mt-4 space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    rec.priority === "high"
                      ? "bg-destructive/5 border-destructive/20"
                      : rec.priority === "medium"
                      ? "bg-warning/5 border-warning/20"
                      : "bg-muted/30 border-border"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-medium uppercase",
                          rec.priority === "high"
                            ? "bg-destructive/20 text-destructive"
                            : rec.priority === "medium"
                            ? "bg-warning/20 text-warning"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {rec.priority}
                      </span>
                      <span className="font-medium text-sm">{rec.title}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {rec.category}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>

                  <div className="bg-muted/50 rounded p-2 mb-2">
                    <p className="text-xs">
                      <span className="font-medium">Action: </span>
                      {rec.action}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary">
                      ✓ {rec.impact}
                    </span>
                    {rec.references && (
                      <a
                        href={rec.references.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {rec.references.label}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
