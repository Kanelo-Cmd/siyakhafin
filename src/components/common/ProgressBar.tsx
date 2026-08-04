import { cn } from "@/lib/utils";

interface Props {
  value: number;
  className?: string;
  color?: "primary" | "success" | "warning" | "danger" | "accent";
}

export function ProgressBar({ value, className, color = "primary" }: Props) {
  return (
    <div className={cn("h-2.5 w-full rounded-full bg-muted overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          backgroundColor: `hsl(var(--${color}))`,
        }}
      />
    </div>
  );
}
