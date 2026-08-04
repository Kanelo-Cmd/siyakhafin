import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/common/Card";
import { ScoreRing } from "@/components/features/ScoreRing";
import { ProgressBar } from "@/components/common/ProgressBar";
import { LockGate } from "@/components/features/LockGate";
import { CoachBubble } from "@/components/features/CoachBubble";
import { useApp } from "@/store/AppStore";
import { computeScores } from "@/lib/scoring";
import { autoColor } from "@/components/features/ScoreRing";

export default function Analysis() {
  const { state } = useApp();
  const scores = computeScores(state);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-ink">AI Credit Analysis</h1>
        <p className="text-muted-foreground">Every score explained in plain language.</p>
      </div>

      {/* Free preview: readiness + fraud */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-5 p-6">
          <ScoreRing value={scores.readiness} sublabel="Readiness" />
          <div>
            <p className="font-display text-lg font-700">{scores.rating} readiness</p>
            <p className="text-sm text-muted-foreground">
              Based on {scores.uploadedDocs} documents and {scores.answeredQuestions} answers.
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-6">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-success/15 text-success">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fraud risk</p>
            <p className="font-display text-2xl font-800 text-success">Low · {scores.fraudRisk}</p>
            <p className="text-xs text-muted-foreground">No contradictions detected in your data.</p>
          </div>
        </Card>
      </div>

      <CoachBubble
        compact
        message="Here's how a credit committee would read your file. Green is strong, amber needs work, red is a blocker."
      />

      <LockGate locked={!state.paid} title="Unlock your detailed analysis">
        <div className="grid gap-4 sm:grid-cols-2">
          {scores.items.map((item) => {
            const color = autoColor(item.value);
            return (
              <Card key={item.key} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{item.label}</p>
                  <span
                    className="font-display text-xl font-800"
                    style={{ color: `hsl(var(--${color}))` }}
                  >
                    {item.value}
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={item.value} color={color} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.hint}</p>
              </Card>
            );
          })}
        </div>
      </LockGate>
    </div>
  );
}
