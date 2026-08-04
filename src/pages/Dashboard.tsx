import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Upload,
  BarChart3,
  Landmark,
  ArrowRight,
  FileStack,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { ScoreRing } from "@/components/features/ScoreRing";
import { ProgressBar } from "@/components/common/ProgressBar";
import { CoachBubble } from "@/components/features/CoachBubble";
import { useApp } from "@/store/AppStore";
import { computeScores } from "@/lib/scoring";

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const scores = computeScores(state);
  const firstName = state.user?.name?.split(" ")[0] || "there";

  const coachMsg =
    scores.completion < 30
      ? `Welcome ${firstName}. Let's start by telling me about your business — it takes 3 minutes and I'll only ask what I truly need.`
      : scores.completion < 70
      ? `Good progress, ${firstName}. Upload your bank statements next — that's the single biggest lift to your readiness right now.`
      : `Excellent work, ${firstName}. Your profile is strong. Review your lender matches and prepare your submission package.`;

  const stats = [
    { label: "Completion", value: `${scores.completion}%`, icon: FileStack, color: "text-primary" },
    { label: "Documents in", value: `${scores.uploadedDocs}/${scores.totalDocs}`, icon: Upload, color: "text-success" },
    { label: "Missing docs", value: `${scores.missingDocs}`, icon: AlertCircle, color: "text-warning" },
    { label: "Rating", value: scores.rating, icon: BarChart3, color: `text-${scores.ratingColor}` },
  ];

  const actions = [
    { to: "/app/assessment", icon: ClipboardList, title: "Continue assessment", desc: `${scores.answeredQuestions}/${scores.totalQuestions} answered` },
    { to: "/app/documents", icon: Upload, title: "Upload documents", desc: `${scores.missingDocs} still needed` },
    { to: "/app/analysis", icon: BarChart3, title: "View analysis", desc: "Scores & insights" },
    { to: "/app/lenders", icon: Landmark, title: "Match lenders", desc: "Ranked by approval" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-ink lg:text-3xl">
          Hello {firstName} 👋
        </h1>
        <p className="text-muted-foreground">Here's your funding readiness overview.</p>
      </div>

      {/* Readiness hero */}
      <Card className="flex flex-col items-center gap-6 bg-gradient-to-br from-primary to-primary/85 p-6 text-primary-foreground sm:flex-row sm:p-8">
        <div className="rounded-full bg-white/10 p-2">
          <ScoreRing value={scores.readiness} sublabel="Readiness" color="accent" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
            {scores.rating} readiness
          </span>
          <h2 className="mt-3 font-display text-2xl font-700">
            You're {scores.readiness}% of the way to a strong application
          </h2>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-primary-foreground/80">
              <span>Overall completion</span>
              <span>{scores.completion}%</span>
            </div>
            <div className="rounded-full bg-white/20">
              <ProgressBar value={scores.completion} color="accent" />
            </div>
          </div>
          <Button variant="gold" className="mt-5" onClick={() => navigate("/app/assessment")}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <p className="mt-3 font-display text-2xl font-800 text-ink">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <CoachBubble message={coachMsg} />

      {/* Actions */}
      <div>
        <h3 className="mb-3 font-display text-lg font-700">Next steps</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((a) => (
            <button
              key={a.to}
              onClick={() => navigate(a.to)}
              className="group flex items-center gap-4 rounded-xl border border-border/70 bg-card p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <a.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
