import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "income" | "expense" | "neutral" | "warning";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  income: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
  expense: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60",
  neutral: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/60",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
};

const Badge = ({ children, tone = "neutral", className }: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
