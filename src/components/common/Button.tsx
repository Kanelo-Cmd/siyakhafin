import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 shadow-soft active:scale-[0.98]",
  gold: "bg-accent text-accent-foreground hover:brightness-105 shadow-soft active:scale-[0.98]",
  outline: "border border-border bg-card text-foreground hover:bg-muted active:scale-[0.98]",
  ghost: "text-foreground hover:bg-muted active:scale-[0.98]",
  soft: "bg-primary-soft text-primary hover:brightness-[0.97] active:scale-[0.98]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
