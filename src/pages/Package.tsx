import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Award,
  FileText,
  Download,
  Mail,
  FileSpreadsheet,
  FileType,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { ScoreRing } from "@/components/features/ScoreRing";
import { useApp } from "@/store/AppStore";
import { computeScores } from "@/lib/scoring";
import { GENERATED_DOCS } from "@/lib/mockData";

export default function PackagePage() {
  const { state } = useApp();
  const scores = computeScores(state);

  if (!state.paid) return <Navigate to="/app/payment" replace />;

  const download = (fmt: string) =>
    toast.success(`Funding Submission Package downloading (${fmt})`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-ink">Funding Submission Package</h1>
        <p className="text-muted-foreground">Branded, lender-ready and complete.</p>
      </div>

      {/* Certificate */}
      <Card className="flex flex-col items-center gap-5 bg-gradient-to-br from-primary to-primary/85 p-6 text-center text-primary-foreground sm:flex-row sm:text-left">
        <div className="rounded-full bg-white/10 p-1.5">
          <ScoreRing value={scores.readiness} sublabel="Score" color="accent" />
        </div>
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
            <Award className="h-4 w-4" /> Funding Readiness Certificate
          </div>
          <h2 className="mt-3 font-display text-2xl font-700">
            {state.user?.name || "Your business"} · {scores.rating} readiness
          </h2>
          <p className="text-sm text-primary-foreground/80">
            Issued by SiyakhaFin AI Credit Assessment · {new Date().toLocaleDateString("en-ZA")}
          </p>
        </div>
      </Card>

      {/* Download / email */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => download("PDF")}>
          <FileText className="h-4 w-4" /> PDF
        </Button>
        <Button variant="outline" onClick={() => download("Word")}>
          <FileType className="h-4 w-4" /> Word
        </Button>
        <Button variant="outline" onClick={() => download("Excel")}>
          <FileSpreadsheet className="h-4 w-4" /> Excel
        </Button>
        <Button
          variant="gold"
          onClick={() => toast.success(`Package emailed to ${state.user?.email || "your inbox"}`)}
        >
          <Mail className="h-4 w-4" /> Email package
        </Button>
      </div>

      {/* Contents */}
      <div>
        <h3 className="mb-3 font-display text-lg font-700">Package contents</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {[...GENERATED_DOCS, "Recommended Lenders", "Supporting Documents Index", "Submission Checklist"].map(
            (doc) => (
              <Card key={doc} className="flex items-center gap-3 p-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-ink">{doc}</span>
                <button
                  onClick={() => download(doc)}
                  className="ml-auto rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                >
                  <Download className="h-4 w-4" />
                </button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
