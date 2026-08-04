import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Smartphone, ShieldCheck, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/features/Logo";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useApp } from "@/store/AppStore";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";
type Step = "form" | "email" | "otp";

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        {...props}
      />
    </label>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [mode, setMode] = useState<Mode>("register");
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [code, setCode] = useState("");

  const upd = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      setUser({ name: form.name || "Business Owner", email: form.email, phone: form.phone, verified: true });
      toast.success("Welcome back");
      navigate("/app");
      return;
    }
    setStep("email");
    toast.info("Verification code sent to your email: 4821");
  };

  const verifyEmail = () => {
    if (code.length < 4) return toast.error("Enter the 4-digit code");
    setCode("");
    setStep("otp");
    toast.info("OTP sent via SMS: 7391");
  };

  const verifyOtp = () => {
    if (code.length < 4) return toast.error("Enter the OTP");
    setUser({ name: form.name, email: form.email, phone: form.phone, verified: true });
    toast.success("Account verified");
    navigate("/app");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Logo className="[&_span]:text-primary-foreground" />
        <div>
          <h2 className="font-display text-4xl font-800 leading-tight">
            Your funding application, prepared by AI.
          </h2>
          <p className="mt-4 max-w-sm text-primary-foreground/80">
            Secure registration, email and OTP verification — then let Nomsa, your AI
            credit manager, guide you to funding readiness.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: ShieldCheck, t: "Bank-grade security" },
              { icon: Mail, t: "Email verification" },
              { icon: Smartphone, t: "OTP protection" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-3 text-sm">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                  <x.icon className="h-5 w-5" />
                </div>
                {x.t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-primary-foreground/60">© {new Date().getFullYear()} SiyakhaFin</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-7">
          <div className="lg:hidden">
            <Logo />
          </div>

          {step === "form" && (
            <>
              <div className="mt-4 flex rounded-full bg-muted p-1">
                {(["register", "login"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-colors",
                      mode === m ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <h1 className="mt-6 font-display text-2xl font-700">
                {mode === "register" ? "Create your account" : "Welcome back"}
              </h1>
              <form onSubmit={submitForm} className="mt-5 space-y-4">
                {mode === "register" && (
                  <Field label="Full name" value={form.name} required onChange={(e) => upd("name", e.target.value)} />
                )}
                <Field label="Email" type="email" value={form.email} required onChange={(e) => upd("email", e.target.value)} />
                {mode === "register" && (
                  <Field label="Mobile number" type="tel" value={form.phone} required onChange={(e) => upd("phone", e.target.value)} />
                )}
                <Field label="Password" type="password" value={form.password} required onChange={(e) => upd("password", e.target.value)} />
                <Button type="submit" size="lg" className="w-full">
                  {mode === "register" ? "Create account" : "Sign in"}
                </Button>
              </form>
            </>
          )}

          {(step === "email" || step === "otp") && (
            <div className="mt-4">
              <button
                onClick={() => setStep(step === "otp" ? "email" : "form")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <div className="mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                {step === "email" ? <Mail className="h-7 w-7" /> : <Smartphone className="h-7 w-7" />}
              </div>
              <h1 className="mt-4 font-display text-2xl font-700">
                {step === "email" ? "Verify your email" : "Enter OTP"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {step === "email"
                  ? `We sent a code to ${form.email || "your email"}.`
                  : `We sent a one-time PIN to ${form.phone || "your phone"}.`}
              </p>
              <input
                inputMode="numeric"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="0000"
                className="mt-5 h-14 w-full rounded-lg border border-input bg-card text-center font-display text-2xl tracking-[0.5em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Button
                size="lg"
                className="mt-4 w-full"
                onClick={step === "email" ? verifyEmail : verifyOtp}
              >
                Verify & continue
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
