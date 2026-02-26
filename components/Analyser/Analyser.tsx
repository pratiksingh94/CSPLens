"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, FileCode, Loader2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import analyse from "@/lib/analyse-csp";
import PolicyBreakdown from "./AnalysedOutput/PolicyBreakdown/PolicyBreakdown";

import CSPOverview from "./AnalysedOutput/CSPOverview/CSPOverview";
import Help from "@/components/Help";
import AttackSurface from "./AnalysedOutput/AttackSurface/AttackSurface";
import Export from "@/components/Export";

import { AnalysedRule, ExportMeta } from "@/types";

const buildMeta = (
  source: "direct-header" | "fetched-url",
  reportOnly: boolean,
  url?: string,
): ExportMeta => ({
  tool: "CSPLens - https://csplens.pratiksingh.xyz",
  generatedAt: new Date().toISOString(),
  input: {
    source,
    url,
    reportOnly,
  },
});

export default function Analyser() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "header">("header");
  const [urlInput, setURLInput] = useState("");
  const [headerInput, setHeaderInput] = useState("");
  const [analysedRules, setAnalysedRules] = useState<AnalysedRule[]>([]);
  const [meta, setMeta] = useState<ExportMeta>({
    tool: "CSPLens - https://csplens.pratiksingh.xyz",
    generatedAt: "",
    input: {
      source: "direct-header",
      reportOnly: false,
    },
  });

  const handleAnalyseBtn = async () => {
    if (!urlInput && !headerInput) {
      toast.error("Please enter a URL or CSP header to analyse");
      return;
    }

    setIsLoading(true);

    try {
      if (inputMode === "url" && urlInput) {
        const res = await fetch("/api/fetch-csp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlInput }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
          return;
        }

        const analysed = analyse(data.csp);
        setAnalysedRules(analysed);

        if (data.reportOnly) {
          toast.warning("CSP is Report-Only");
        }

        setMeta(buildMeta("fetched-url", data.reportOnly, urlInput));
      } else if (inputMode === "header" && headerInput) {
        const analysed = analyse(headerInput);
        setAnalysedRules(analysed);
        setMeta(buildMeta("direct-header", false));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeToggle = () => {
    setInputMode(inputMode === "url" ? "header" : "url");
    setURLInput("");
    setHeaderInput("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {inputMode === "url" ? (
              <Search className="h-5 w-5 text-primary" />
            ) : (
              <FileCode className="h-5 w-5 text-primary" />
            )}
            <span className="font-medium">
              {inputMode === "url" ? "Fetch from URL" : "Paste CSP Header"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleModeToggle}
            className="text-muted-foreground cursor-pointer"
          >
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Switch method
          </Button>
        </div>

        {inputMode === "url" ? (
          <div className="space-y-2">
            <Label htmlFor="csp-link">Website URL</Label>
            <Input
              type="url"
              id="csp-link"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setURLInput(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll fetch the CSP header from the given URL
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="csp-header">CSP Header Value</Label>
            <Textarea
              id="csp-header"
              placeholder="default-src 'self'; script-src 'self' 'unsafe-inline'..."
              className="font-mono text-sm min-h-[100px]"
              value={headerInput}
              onChange={(e) => setHeaderInput(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Paste the full CSP header value (with or without the header name)
            </p>
          </div>
        )}

        <Button
          className="mt-4 w-full sm:w-auto cursor-pointer"
          onClick={handleAnalyseBtn}
          disabled={isLoading || (!urlInput && !headerInput)}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analysing...
            </>
          ) : (
            "Analyse"
          )}
        </Button>
      </div>

      {analysedRules.length > 0 && (
        <>
          <Export data={analysedRules} meta={meta} />
          <Help />
          <CSPOverview data={analysedRules} />
          <AttackSurface data={analysedRules} />
          <PolicyBreakdown data={analysedRules} />
        </>
      )}
    </div>
  );
}
