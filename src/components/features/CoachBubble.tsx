import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function CoachBubble({
  message,
  className,
  compact = false,
}: {
  message: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-primary-soft px-4 py-3">
        {!compact && (
          <p className="text-xs font-semibold text-primary">
            Nomsa · AI Senior Credit Manager
          </p>
        )}
        <p className="mt-0.5 text-sm leading-relaxed text-ink">{message}</p>
      </div>
    </div>
  );
}
