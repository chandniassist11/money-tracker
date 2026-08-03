import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "income" | "expense" | "neutral" | "warning";

const toneClasses: Record<Tone, { badge: string; dot: string }> = {
  income: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    dot: "bg-emerald-500",
  },
  expense: {
    badge: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    dot: "bg-rose-500",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
    dot: "bg-slate-400",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    dot: "bg-amber-500",
  },
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const Badge = ({ children, tone = "neutral", className }: BadgeProps) => {
  const t = toneClasses[tone];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "text-xs font-semibold tracking-tight",
        t.badge,
        className
      )}
    >
      <span className={clsx("h-1.5 w-1.5 shrink-0 rounded-full", t.dot)} />
      {children}
    </span>
  );
};

export default Badge;