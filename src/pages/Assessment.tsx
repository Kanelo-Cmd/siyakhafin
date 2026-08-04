import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Building2, Store, Rocket, ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { CoachBubble } from "@/components/features/CoachBubble";
import { ProgressBar } from "@/components/common/ProgressBar";
import { useApp } from "@/store/AppStore";
import { APPLICANT_TYPES, questionsForType, type Question } from "@/lib/mockData";
import { computeScores } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import type { ApplicantType } from "@/store/AppStore";

const ICONS: Record<string, typeof User> = { User, Building2, Store, Rocket };

function QuestionField({ q }: { q: Question }) {
  const { state, setAnswer } = useApp();
  const value = state.answers[q.id] || "";
  const base =
    "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{q.label}</label>
      {q.hint && <p className="mb-1.5 text-xs text-muted-foreground">{q.hint}</p>}
      {q.type === "select" ? (
        <select className={cn(base, "h-11")} value={value} onChange={(e) => setAnswer(q.id, e.target.value)}>
          <option value="">Select…</option>
          {q.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : q.type === "textarea" ? (
        <textarea rows={2} className={base} value={value} onChange={(e) => setAnswer(q.id, e.target.value)} />
      ) : (
        <input
          type={q.type}
          className={cn(base, "h-11")}
          value={value}
          onChange={(e) => setAnswer(q.id, e.target.value)}
        />
      )}
    </div>
  );
}

export default function Assessment() {
  const { state, setApplicantType } = useApp();
  const navigate = useNavigate();
  const scores = computeScores(state);
  const [section, setSection] = useState<"business" | "funding">("business");

  if (!state.applicantType) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-800 text-ink">Let's begin</h1>
          <p className="text-muted-foreground">First, how are you applying?</p>
        </div>
        <CoachBubble message="This decides everything I ask next — I won't waste your time on questions that don't apply to you." />
        <div className="grid gap-3 sm:grid-cols-2">
          {APPLICANT_TYPES.map((t) => {
            const Icon = ICONS[t.icon];
            return (
              <button
                key={t.id}
                onClick={() => {
                  setApplicantType(t.id as ApplicantType);
                  toast.success(`Great — tailoring your assessment`);
                }}
                className="group flex items-start gap-4 rounded-xl border border-border/70 bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg font-700">{t.title}</p>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const questions = questionsForType(state.applicantType);
  const sectionQuestions = questions.filter((q) => q.section === section);
  const typeLabel = APPLICANT_TYPES.find((t) => t.id === state.applicantType)?.title;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-800 text-ink">Assessment</h1>
          <p className="text-sm text-muted-foreground">
            Applying: <span className="font-medium text-primary">{typeLabel}</span> · Auto-saved
          </p>
        </div>
        <div className="w-40">
          <ProgressBar value={scores.completion} />
        </div>
      </div>

      <CoachBubble
        compact
        message="I've skipped anything already read from your documents. Just fill what's left — you can leave and resume anytime."
      />

      <div className="flex rounded-full bg-muted p-1">
        {(["business", "funding"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-colors",
              section === s ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
            )}
          >
            {s} details
          </button>
        ))}
      </div>

      <Card className="space-y-5 p-5 sm:p-6">
        {sectionQuestions.map((q) => (
          <QuestionField key={q.id} q={q} />
        ))}
      </Card>

      <div className="flex flex-wrap gap-3">
        {section === "business" ? (
          <Button size="lg" onClick={() => setSection("funding")}>
            Funding details <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="lg" onClick={() => navigate("/app/documents")}>
            <Check className="h-4 w-4" /> Continue to documents
          </Button>
        )}
        <Button size="lg" variant="outline" onClick={() => navigate("/app")}>
          Save & exit
        </Button>
      </div>
    </div>
  );
}
