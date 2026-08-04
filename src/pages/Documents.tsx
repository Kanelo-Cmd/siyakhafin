import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Check,
  ScanLine,
  ShieldCheck,
  Wallet,
  Paperclip,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { ProgressBar } from "@/components/common/ProgressBar";
import { CoachBubble } from "@/components/features/CoachBubble";
import { useApp } from "@/store/AppStore";
import { docsForType, type DocDef } from "@/lib/mockData";
import { computeScores } from "@/lib/scoring";

const CATEGORY_META = {
  compliance: { title: "Compliance", icon: ShieldCheck, note: "Never AI-generated — required originals." },
  financial: { title: "Financial", icon: Wallet, note: "OCR extracts revenue, cashflow & more." },
  supporting: { title: "Supporting", icon: Paperclip, note: "Proof of repayment ability." },
} as const;

function DocCard({ def }: { def: DocDef }) {
  const { state, uploadDocument, updateExtracted } = useApp();
  const record = state.documents[def.id];

  const handleUpload = () => {
    uploadDocument(def.id, def.extract);
    toast.success(`${def.label} scanned — details extracted`, {
      description: "Review and edit the extracted information below.",
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
            record?.uploaded ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
          }`}
        >
          {record?.uploaded ? <Check className="h-5 w-5" /> : <ScanLine className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">{def.label}</p>
          <p className="text-xs text-muted-foreground">
            {record?.uploaded ? "Extracted ✓" : "Not uploaded"}
          </p>
        </div>
        <Button size="sm" variant={record?.uploaded ? "outline" : "soft"} onClick={handleUpload}>
          <UploadCloud className="h-4 w-4" />
          {record?.uploaded ? "Replace" : "Upload"}
        </Button>
      </div>

      {record?.uploaded && record.extracted && (
        <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
          {Object.entries(record.extracted).map(([field, value]) => (
            <div key={field} className="flex items-center gap-2">
              <span className="w-1/2 text-xs text-muted-foreground">{field}</span>
              <input
                value={value}
                onChange={(e) => updateExtracted(def.id, field, e.target.value)}
                className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function Documents() {
  const { state } = useApp();
  const navigate = useNavigate();
  const scores = computeScores(state);
  const docs = docsForType(state.applicantType);

  const categories = ["compliance", "financial", "supporting"] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-800 text-ink">Documents</h1>
          <p className="text-sm text-muted-foreground">
            {scores.uploadedDocs}/{scores.totalDocs} uploaded · each one lifts your score
          </p>
        </div>
        <div className="w-40">
          <ProgressBar value={Math.round((scores.uploadedDocs / scores.totalDocs) * 100)} color="success" />
        </div>
      </div>

      <CoachBubble
        compact
        message="Upload a document and I'll read it instantly — no typing. Just confirm what I extracted."
      />

      {categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const list = docs.filter((d) => d.category === cat);
        return (
          <div key={cat}>
            <div className="mb-2 flex items-center gap-2">
              <meta.icon className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-700">{meta.title}</h3>
              <span className="text-xs text-muted-foreground">— {meta.note}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((d) => (
                <DocCard key={d.id} def={d} />
              ))}
            </div>
          </div>
        );
      })}

      <Button size="lg" onClick={() => navigate("/app/analysis")}>
        See my analysis <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
