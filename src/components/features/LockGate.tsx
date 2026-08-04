import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import type { ReactNode } from "react";

export function LockGate({
  locked,
  title,
  children,
}: {
  locked: boolean;
  title: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  if (!locked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[6px] opacity-60">{children}</div>
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="max-w-sm rounded-xl border border-border bg-card/95 p-6 text-center shadow-card">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/15 text-accent">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-display text-lg font-700">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Unlock your full analysis, lender matches and submission package.
          </p>
          <Button className="mt-4 w-full" variant="gold" onClick={() => navigate("/app/payment")}>
            Unlock now
          </Button>
        </div>
      </div>
    </div>
  );
}
