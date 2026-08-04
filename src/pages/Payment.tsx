import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, Lock, FileText, ShieldCheck } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/store/AppStore";
import { computeScores } from "@/lib/scoring";
import { formatRand } from "@/lib/utils";

const METHODS = [
  "Instant EFT", "Ozow", "Peach Payments", "PayFast", "Capitec Pay",
  "SnapScan", "Zapper", "PayShap", "Debit Card", "Credit Card",
  "Google Pay", "Apple Pay",
];

const LOCKED = [
  "All AI-generated documents",
  "Detailed credit analysis & scores",
  "Ranked lender recommendations",
  "Full Funding Submission Package",
];

const PRICE = 499;

export default function Payment() {
  const { state, setPaid } = useApp();
  const navigate = useNavigate();
  const scores = computeScores(state);

  const pay = () => {
    setPaid(true);
    toast.success("Payment successful — package unlocked");
    navigate("/app/package");
  };

  if (state.paid) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-800">You're unlocked</h1>
        <p className="mt-1 text-muted-foreground">Your full package and lender matches are available.</p>
        <Button className="mt-5" onClick={() => navigate("/app/package")}>
          View my package
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-3 font-display text-2xl font-800 text-ink">Assessment complete</h1>
        <p className="text-muted-foreground">Here's your preview — unlock to see everything.</p>
      </div>

      {/* Preview stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Completion", v: `${scores.completion}%` },
          { l: "Docs generated", v: `${scores.generatedDocs}` },
          { l: "Docs missing", v: `${scores.missingDocs}` },
          { l: "Readiness", v: scores.rating },
        ].map((s) => (
          <Card key={s.l} className="p-4 text-center">
            <p className="font-display text-2xl font-800 text-primary">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-display text-lg font-700">
            <Lock className="h-5 w-5 text-accent" /> Locked until payment
          </h3>
          <ul className="mt-3 space-y-2">
            {LOCKED.map((x) => (
              <li key={x} className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" /> {x}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col bg-gradient-to-br from-primary to-primary/85 p-6 text-primary-foreground">
          <p className="text-sm text-primary-foreground/80">One-time unlock</p>
          <p className="font-display text-4xl font-800">{formatRand(PRICE)}</p>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Full submission package · PDF, Word & Excel · email delivery
          </p>
          <Button variant="gold" size="lg" className="mt-5" onClick={pay}>
            Unlock my package
          </Button>
        </Card>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Supported payment methods</p>
        <div className="flex flex-wrap gap-2">
          {METHODS.map((m) => (
            <span
              key={m}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-ink"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
