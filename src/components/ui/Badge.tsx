import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "income" | "expense" | "neutral" | "warning";

const toneClasses: Record<Tone, { badge: string; dot: string }> = {
  income: {
    badge: "bg-success-500/10 text-success-600 ring-1 ring-inset ring-success-500/20",
    dot: "bg-success-500",
  },
  expense: {
    badge: "bg-danger-500/10 text-danger-600 ring-1 ring-inset ring-danger-500/20",
    dot: "bg-danger-500",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
    dot: "bg-slate-400",
  },
  warning: {
    badge: "bg-warning-500/10 text-warning-600 ring-1 ring-inset ring-warning-500/20",
    dot: "bg-warning-500",
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
        "text-xs font-bold tracking-tight",
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
