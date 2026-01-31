"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

import analyse from "@/lib/analyse-csp";
import PolicyBreakdown from "./AnalysedOutput/PolicyBreakdown/PolicyBreakdown";

import { AnalysedRule, ExportMeta, MissingDirective } from "@/types";
import CSPOverview from "./AnalysedOutput/CSPOverview/CSPOverview";
import Help from "./Help";
import AttackSurface from "./AnalysedOutput/AttackSurface/AttackSurface";
import Export from "./Export";

// lil helper
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

  const [urlInput, setURLInput] = useState("");
  const [headerInput, setHeaderInput] = useState("");

  const [analysedRules, setAnalysedRules] = useState<AnalysedRule[]>([]);

  //random data just to please typescript
  const [meta, setMeta] = useState<ExportMeta>({
    tool: "CSPLens - https://csplens.pratiksingh.xyz",
    generatedAt: "",
    input: {
      source: "direct-header",
      reportOnly: false,
    },
  });

  const handleAnalyseBtn = async () => {
    if (!urlInput && !headerInput)
      toast.error(
        "At least one input is required to analyse, URL or CSP header",
      );
    if (urlInput != "" && headerInput != "")
      toast.error(
        "Only one input is allowed at a time, either site URL or direct CSP header paste",
      );

    setIsLoading(true);

    try {
      if (urlInput) {
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
      } else {
        const analysed = analyse(headerInput);
        setAnalysedRules(analysed);
        setMeta(buildMeta("direct-header", false));
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2 rounded-lg border border-border bg-card p-5">
      <div className="mt-4 rounded-md bg-primary/5 p-4 shadow-sm border border-border/50">
        <Label htmlFor="csp-link">Enter your site link:</Label>
        <Input
          type="text"
          id="csp-link"
          placeholder="https://example.com"
          className="mt-2 max-h-2xl"
          value={urlInput}
          onChange={(e) => setURLInput(e.target.value)}
          // disabled={true}
          disabled={isLoading || !!headerInput}
        />
        <p className="text-center m-4">OR</p>
        <Label htmlFor="csp-header">Enter your CSP header:</Label>
        <Textarea
          id="csp-header"
          placeholder="content-security-policy: default-src..."
          className="mt-2 max-h-2xl overflow-hidden"
          value={headerInput}
          onChange={(e) => setHeaderInput(e.target.value)}
          disabled={isLoading || !!urlInput}
          rows={1}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
        />
        <Button
          className="mt-4 flex p-6 text-lg cursor-pointer"
          onClick={handleAnalyseBtn}
          disabled={isLoading}
        >
          {isLoading ? "Analysing..." : "Analyse"}
        </Button>
      </div>
      {isLoading && (
        <div className="mt-6 rounded-md border border-border/50 p-4">
          <p className="text-sm text-muted-foreground">
            Preparing analysis results…
          </p>
        </div>
      )}

      {!(analysedRules.length === 0) && (
        <>
          <Export data={analysedRules} meta={meta} /> <Help />
          <CSPOverview data={analysedRules} />
          <AttackSurface data={analysedRules} />
          <PolicyBreakdown data={analysedRules} />
        </>
      )}
    </div>
  );
}
