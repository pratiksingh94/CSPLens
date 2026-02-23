"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus } from "lucide-react";
import { useRef, useState } from "react";

const SUGGESTIONS = [
  "'self'",
  "'none'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  "'strict-dynamic'",
  "https:",
  "data:",
  "blob:",
];

interface Props {
  onAdd: (source: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// TODO: COMPLETE THIS AND DIRECTIVE CARD THEN CONTINUE MAIN FILE

export function SourceInput({
  onAdd,
  disabled = false,
  placeholder = "Add source...",
  className,
}: Props) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase()),
  ).slice(0, 5);

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSUggestionClick = (s: string) => {
    onAdd(s);
    setValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => value.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-8"
          />

          {filteredSuggestions.length > 0 && (
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition-colors"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  showSuggestions && "rotate-180",
                )}
              />
            </button>
          )}
        </div>
        <Button
          onClick={handleAdd}
          disabled={disabled || !value.trim()}
          size="icon"
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* AUTOSUGGESTIONS DROPDOWN  */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absoute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg animate-in fade-in slide-in-from-top-2">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSUggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-primary/10 focus:bg-primary/10 focus:outline-none first: rounded-t-md last:rounded-b-md transition-colors cursor-pointer"
            >
              <code className="font-mono">{suggestion}</code>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
