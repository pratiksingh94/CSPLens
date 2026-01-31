import { AnalysedRule, ExportMeta } from "@/types";
import { Button } from "./ui/button";
import { generateExportData, generateMDExport } from "@/lib/generate-export";

type Props = {
  data: AnalysedRule[],
  meta: ExportMeta
}

export default function Export({ data, meta }: Props) {
  const handleJSONExportBtn = () => {
    const ts = new Date(meta?.generatedAt).toISOString().replace(/[:.]/g, "-")

    const exportData = generateExportData(data, meta)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CSPLens-report-${ts}.json`;
    a.click()
    URL.revokeObjectURL(url);
  }

  const handleMDExportBtn = () => {
    const ts = new Date(meta?.generatedAt).toISOString().replace(/[:.]/g, "-")

    const exportData = generateExportData(data, meta)
    const md = generateMDExport(exportData)
    const blob = new Blob([md], {
      type: "text/markdown"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CSPLens-report-${ts}.md`;
    a.click()
    URL.revokeObjectURL(url);
  }
  return (
    <div className="mt-4 rounded-md border border-border/50 bg-primary/5 p-4 shadow-sm">
      <h3 className="text-lg font-bold tracking-tight">Export Analysis</h3>

      <p className="text-sm text-muted-foreground">
        Download a machine-readable CSP analysis report
      </p>
      <Button
          className="mt-4 mx-1 cursor-pointer"
          onClick={handleJSONExportBtn}
          disabled={data.length === 0}
        >
          Export as JSON
      </Button>
      <Button
          className="mt-4 mx-1 cursor-pointer"
          onClick={handleMDExportBtn}
          disabled={data.length === 0}
        >
          Export as Markdown
      </Button>
      {/* <Button onClick={() => window.print()}>Export as PDF</Button> */}
    </div>
  );
}
