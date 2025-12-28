"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import analyse from "@/lib/analyse-csp";


export default function Analyser() {
  const [urlInput, setURLInput] = useState("");
  const [headerInput, setHeaderInput] = useState("");

  const handleAnalyseBtn = () => {
    if(!urlInput && !headerInput) toast.error("At least one input is required to analyse, URL or CSP header")
    if (urlInput != "" && headerInput != "")
      toast.error(
        "Only one input is allowed at a time, either site URL or direct CSP header paste"
      );
    
    if(urlInput) {
      // todo
    } else {
      const analysed = analyse(headerInput)
      console.log(analysed)
    }
  };

  return (
    <div className="mt-2 rounded-lg border border-border bg-card p-5">
      <div className="mt-2 rounded-sm bg-primary/10 p-3 shadow">
        <Label htmlFor="csp-link">Enter your site link:</Label>
        <Input
          type="text"
          id="csp-link"
          placeholder="hi"
          className="mt-2 max-h-2xl"
          value={urlInput}
          onChange={(e) => setURLInput(e.target.value)}
          disabled={!!headerInput}
        />
        <p className="text-center m-4">OR</p>
        <Label htmlFor="csp-header">Enter your CSP header:</Label>
        <Textarea
          id="csp-header"
          placeholder="hi"
          className="mt-2 max-h-2xl"
          value={headerInput}
          onChange={(e) => setHeaderInput(e.target.value)}
          disabled={!!urlInput}
        />
        <Button
          className="mt-4 flex p-6 text-lg cursor-pointer"
          onClick={handleAnalyseBtn}
        >
          Analyse
        </Button>
      </div>
    </div>
  );
}
