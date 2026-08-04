import { Lightbulb, TrendingUp, Target } from "lucide-react";
import { Card } from "@/components/common/Card";
import { CoachBubble } from "@/components/features/CoachBubble";
import { ScoreRing } from "@/components/features/ScoreRing";
import { useApp } from "@/store/AppStore";
import { computeScores, coachTips } from "@/lib/scoring";

export default function Coach() {
  const { state } = useApp();
  const scores = computeScores(state);
  const tips = coachTips(state, scores);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-ink">Funding Coach</h1>
        <p className="text-muted-foreground">Practical steps to strengthen your application.</p>
      </div>

      <Card className="flex items-center gap-5 bg-gradient-to-br from-primary to-primary/85 p-6 text-primary-foreground">
        <div className="rounded-full bg-white/10 p-1.5">
          <ScoreRing value={scores.readiness} size={104} stroke={10} sublabel="Now" color="accent" />
        </div>
        <div>
          <p className="font-display text-lg font-700">
            {scores.rating === "High"
              ? "You're funding ready"
              : "Let's raise your readiness"}
          </p>
          <p className="text-sm text-primary-foreground/80">
            Complete the actions below to move toward a High rating and better approval odds.
          </p>
        </div>
      </Card>

      <CoachBubble message="I never just reject an application — I coach it. Here's exactly what I'd fix first if this were on my desk." />

      <div className="space-y-3">
        {tips.map((tip, i) => (
          <Card key={i} className="flex items-start gap-4 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
              {i === 0 ? <Target className="h-5 w-5" /> : i % 2 ? <TrendingUp className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Action {i + 1}</p>
              <p className="text-sm text-ink">{tip}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
