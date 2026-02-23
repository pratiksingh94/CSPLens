"use client"

import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useState } from "react"

interface Props {
  onImport: (csp: string) => void;
  className?: string;
}

export function ImportCSP({ onImport, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleImport = () => {
    if(!value.trim()) {
      toast.error("Please enter a CSP to import");
      return;
    }

    onImport(value);
    setValue("");
    setIsOpen(false);
    toast.success("CSP imported!");
  }

  return (
    <div className={cn("relative", className)}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="gap-1.5 cursor-pointer">
        <Upload className="h-3.5 w-3.5"/>
        Import
      </Button>

      {isOpen && (
        <>
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}/>
          <div className="absolute z-50 mt-2 w-80 right-0 bg-card border border-border rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">
                Import CSP
              </span>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded">
                <X className="h-4 w-4"/>
              </button>
            </div>
            <Textarea
            placeholder="Paste CSP header..."
            value={value}
            onChange={e => setValue(e.target.value)}
            className="min-h-[80px] mb-3 font-mono text-xs"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="flex-1 cursor-pointer">Cancel</Button>
              <Button className="flex-1 cursor-pointer" size="sm" onClick={handleImport}>Import</Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}