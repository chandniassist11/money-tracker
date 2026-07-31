import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "income" | "expense" | "neutral" | "warning";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  income: "bg-emerald-100 text-emerald-700",
  expense: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-600",
  warning: "bg-amber-100 text-amber-700",
};

const Badge = ({ children, tone = "neutral", className }: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
