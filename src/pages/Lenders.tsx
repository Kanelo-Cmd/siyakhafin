import { Landmark, Trophy, Check, Info } from "lucide-react";
import { Card } from "@/components/common/Card";
import { ProgressBar } from "@/components/common/ProgressBar";
import { LockGate } from "@/components/features/LockGate";
import { CoachBubble } from "@/components/features/CoachBubble";
import { useApp } from "@/store/AppStore";
import { computeScores, matchLenders } from "@/lib/scoring";
import { autoColor } from "@/components/features/ScoreRing";

const MEDAL = ["bg-accent text-accent-foreground", "bg-muted text-ink", "bg-primary-soft text-primary"];

export default function Lenders() {
  const { state } = useApp();
  const scores = computeScores(state);
  const matches = matchLenders(state, scores);
  const top3 = matches.slice(0, 3);
  const rest = matches.slice(3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-ink">Lender Matches</h1>
        <p className="text-muted-foreground">Ranked by likelihood of approval for your profile.</p>
      </div>

      <CoachBubble
        compact
        message="I compared your file against each lender's public funding criteria. Pick one and I'll ask any extra questions they need."
      />

      <LockGate locked={!state.paid} title="Unlock your lender matches">
        <div className="space-y-3">
          {top3.map((l, i) => {
            const color = autoColor(l.approval);
            return (
              <Card key={l.id} className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${MEDAL[i]}`}>
                    {i === 0 ? <Trophy className="h-6 w-6" /> : <span className="font-display font-800">{i + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg font-700">{l.name}</p>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                        {l.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{l.focus}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-800" style={{ color: `hsl(var(--${color}))` }}>
                      {l.approval}%
                    </p>
                    <p className="text-[10px] uppercase text-muted-foreground">Approval</p>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={l.approval} color={color} />
                </div>
                <ul className="mt-3 space-y-1">
                  {l.reasons.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-success" /> {r}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}

          <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" /> Other lenders considered
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {rest.map((l) => (
              <Card key={l.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{l.name}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{l.approval}%</span>
              </Card>
            ))}
          </div>
        </div>
      </LockGate>
    </div>
  );
}
