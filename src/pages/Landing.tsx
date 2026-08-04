import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ScanLine,
  BarChart3,
  Landmark,
  Sparkles,
  FileCheck2,
  ArrowRight,
  Check,
} from "lucide-react";
import { Logo } from "@/components/features/Logo";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import heroImg from "@/assets/hero.jpg";

const FEATURES = [
  { icon: ScanLine, title: "Smart document scan", desc: "OCR reads your ID, CIPC & statements — no retyping." },
  { icon: BarChart3, title: "Funding readiness score", desc: "See exactly where you stand, 0 to 100." },
  { icon: Landmark, title: "Lender matching", desc: "Ranked by approval likelihood across SA lenders." },
  { icon: Sparkles, title: "AI credit coach", desc: "25 years of credit expertise, guiding every step." },
];

const STEPS = [
  { n: "01", title: "Tell us about you", desc: "Individual, company, informal or start-up." },
  { n: "02", title: "Upload documents", desc: "We extract the details automatically." },
  { n: "03", title: "Get your score", desc: "Readiness, affordability & risk explained simply." },
  { n: "04", title: "Match & submit", desc: "Download a lender-ready funding package." },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" /> Lender-agnostic · Built for SA MSMEs
          </span>
          <h1 className="mt-5 font-display text-4xl font-800 leading-[1.05] text-ink text-balance lg:text-6xl">
            Get <span className="text-primary">funding ready</span> before you apply.
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            SiyakhaFin thinks like a senior credit manager — preparing your documents,
            scoring your business and matching you to the right lenders.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Start free assessment <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              I have an account
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["Banks", "Fintech lenders", "DFIs", "Government funds"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success" /> {t}
              </span>
            ))}
          </div>
        </div>
        <div className="relative animate-scale-in">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" />
          <img
            src={heroImg}
            alt="South African business owner reviewing funding readiness dashboard"
            className="relative w-full rounded-[1.75rem] border border-border/60 shadow-card"
          />
          <Card className="absolute -bottom-5 -left-3 hidden items-center gap-3 px-4 py-3 sm:flex">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-success/15 text-success">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Readiness score</p>
              <p className="font-display text-xl font-800 text-success">78 · High</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container py-8 lg:py-14">
        <h2 className="text-center font-display text-3xl font-700 text-ink">
          Everything a lender wants — prepared for you
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-5 transition-transform hover:-translate-y-1">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-700">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="container py-8 lg:py-14">
        <Card className="overflow-hidden bg-primary p-8 text-primary-foreground lg:p-12">
          <h2 className="font-display text-3xl font-700">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-display text-3xl font-800 text-accent">{s.n}</p>
                <h3 className="mt-2 font-display text-lg font-600">{s.title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">{s.desc}</p>
              </div>
            ))}
          </div>
          <Button size="lg" variant="gold" className="mt-9" onClick={() => navigate("/auth")}>
            <FileCheck2 className="h-4 w-4" /> Build my funding package
          </Button>
        </Card>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} SiyakhaFin. Built for South African MSMEs.</p>
          <Link to="/auth" className="font-medium text-primary hover:underline">
            Get started
          </Link>
        </div>
      </footer>
    </div>
  );
}
