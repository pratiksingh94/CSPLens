"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

import analyse from "@/lib/analyse-csp";
import PolicyBreakdown from "./AnalysedOutput/PolicyBreakdown/PolicyBreakdown";

import { AnalysedRule, MissingDirective } from "@/types";
import CSPOverview from "./AnalysedOutput/CSPOverview/CSPOverview";
import Help from "./Help";
import AttackSurface from "./AnalysedOutput/AttackSurface/AttackSurface";

export default function Analyser() {
  const [urlInput, setURLInput] = useState("");
  const [headerInput, setHeaderInput] = useState("");

  const [analysedRules, setAnalysedRules] = useState<AnalysedRule[]>([]);

  const handleAnalyseBtn = () => {
    if (!urlInput && !headerInput)
      toast.error(
        "At least one input is required to analyse, URL or CSP header",
      );
    if (urlInput != "" && headerInput != "")
      toast.error(
        "Only one input is allowed at a time, either site URL or direct CSP header paste",
      );

    if (urlInput) {
      fetch("/api/fetch-csp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput })
      }).then(async(res) => {
        const data = await res.json();
        if(!res.ok) {
          toast.error(data.error);
          return;
        }

        const analysed = analyse(data.csp);
        setAnalysedRules(analysed)

        if(data.reportOnly) {
          toast.warning("CSP is Report-Only");
        }
      }).catch(err => {
        toast.error(err.message)
      })
    } else {
      const analysed = analyse(headerInput);
      // console.log(analysed);
      setAnalysedRules(analysed);
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
          disabled={!!headerInput}
        />
        <p className="text-center m-4">OR</p>
        <Label htmlFor="csp-header">Enter your CSP header:</Label>
        <Textarea
          id="csp-header"
          placeholder="content-security-policy: default-src..."
          className="mt-2 max-h-2xl overflow-hidden"
          value={headerInput}
          onChange={(e) => setHeaderInput(e.target.value)}
          disabled={!!urlInput}
          rows={1}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
        />
        <Button
          className="mt-4 flex p-6 text-lg cursor-pointer"
          onClick={handleAnalyseBtn}
        >
          Analyse
        </Button>
      </div>
      {!(analysedRules.length === 0) && (
        <>
          <Help/>
          <CSPOverview data={analysedRules} />
          <AttackSurface data={analysedRules}/>
          <PolicyBreakdown data={analysedRules} />
        </>
      )}
    </div>
  );
}
