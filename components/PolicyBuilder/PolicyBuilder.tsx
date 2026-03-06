"use client";

import {
  AlertCircle,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Search,
  Shield,
  Sparkles,
  XCircle,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

import { CSP_DIRECTIVES } from "./constants";
import { cn } from "@/lib/utils";

import { usePolicyBuilder } from "./hooks/usePolicyBuilder";

import { DirectiveCard } from "./components/DirectiveCard";
import { BooleanDirectiveToggle } from "./components/BooleanDirectiveToggle";
import { ImportCSP } from "./components/ImportCSP";
import { PresetSelctor } from "./components/PresetSelector";
import { Overivew } from "./components/Overview";

export function PolicyBuilder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const policyBuilder = usePolicyBuilder();
  const {
    importCSP,
    applyPreset,
    addSelfToAll,
    clearAll,
    setReportOnly,
    toggleDirective,
    addSource,
    removeSource,
    toggleBooleanDirective,
    attackSurface,
    reportOnly,
    enabledCount,
    overview,
    generateCSP,
    policy,
    booleanDirectives,
  } = policyBuilder;

  const filteredDirective = CSP_DIRECTIVES.filter((d) => {
    if (d.boolean) return false;
    return (
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const booleanDirectivesList = CSP_DIRECTIVES.filter(
    (d) => d.boolean === true,
  );
  const hasCSP = enabledCount > 0;

  const handleCopy = async () => {
    if (!generateCSP) return;
    await navigator.clipboard.writeText(generateCSP);
    setCopied(true);
    toast.success("CSP copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <PresetSelctor onSelect={applyPreset} className="w-36" />
        <ImportCSP onImport={importCSP} />
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search directives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addSelfToAll}
          disabled={enabledCount === 0}
          className="cursor-pointer"
        >
          + &apos;self&apos;
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          disabled={enabledCount === 0}
          className="cursor-pointer"
        >
          Clear
        </Button>
      </div>

      {hasCSP && (
        <Overivew
          overview={overview}
          generateCSP={generateCSP}
          reportOnly={reportOnly}
          setReportOnly={setReportOnly}
          attackSurface={attackSurface}
        />
      )}

      {/* EMPTY STATE  */}
      {!hasCSP && (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Shield className="h-10 w-10 mx-auto mb-3 text-primary/40" />
          <h3 className="font-semibold mb-1">Start Building Your CSP</h3>
          <p className="text-sm text-muted-foreground">
            Selct a preset or enable directives below
          </p>
        </div>
      )}

      {/* DIRECTIVES  */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span className="text-sm font-medium">
            Directives{" "}
            {enabledCount > 0 && (
              <span className="text-primary">({enabledCount})</span>
            )}
          </span>
        </div>

        <div className="space-y-2">
          {filteredDirective.map((dir) => (
            <DirectiveCard
              key={dir.name}
              directive={dir}
              state={policy.get(dir.name) || { enabled: false, sources: [] }}
              onToggle={() => toggleDirective(dir.name)}
              onAddSource={(s) => addSource(dir.name, s)}
              onRemoveSource={(s) => removeSource(dir.name, s)}
            />
          ))}
        </div>
      </div>

      {/* BOOLEAN DIRECTIVES  */}
      {searchQuery === "" && (
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-mediumm">Boolean Directives</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {booleanDirectivesList.map((dir) => (
              <BooleanDirectiveToggle
                key={dir.name}
                name={dir.name}
                icon={dir.icon}
                enabled={booleanDirectives.has(dir.name)}
                onToggle={() => toggleBooleanDirective(dir.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
