interface Props {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  color?: "primary" | "success" | "warning" | "danger" | "accent";
}

export function autoColor(value: number): Props["color"] {
  if (value >= 72) return "success";
  if (value >= 45) return "warning";
  return "danger";
}

export function ScoreRing({
  value,
  size = 132,
  stroke = 12,
  label,
  sublabel,
  color,
}: Props) {
  const c = color ?? autoColor(value);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`hsl(var(--${c}))`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-800" style={{ color: `hsl(var(--${c}))` }}>
          {Math.round(value)}
          {label === "%" ? "" : ""}
        </span>
        {sublabel && (
          <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
