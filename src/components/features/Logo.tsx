import { cn } from "@/lib/utils";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-soft">
        <svg viewBox="0 0 32 32" className="h-5 w-5">
          <path
            d="M9 21c2.5 1.6 5 2.4 7.5 2.4 3 0 5-1.3 5-3.5 0-4.6-11.5-2.6-11.5-8.3C10 8.7 12.6 7 16.4 7c2 0 4 .5 6 1.6"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {!mark && (
        <span className="font-display text-lg font-800 tracking-tight text-ink">
          Siyakha<span className="text-primary">Fin</span>
        </span>
      )}
    </div>
  );
}
