import type { ReactNode } from "react";
import Card from "../ui/Card";
import clsx from "clsx";

type Tone = "blue" | "teal" | "rose" | "amber";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  tone?: Tone;
  subtitle?: string;
}

const toneClasses: Record<Tone, { iconBg: string; iconText: string; accent: string }> = {
  blue: {
    iconBg: "bg-primary-50",
    iconText: "text-primary-600",
    accent: "from-primary-500/0 to-primary-500/8",
  },
  teal: {
    iconBg: "bg-accent-500/10",
    iconText: "text-accent-600",
    accent: "from-accent-500/0 to-accent-500/8",
  },
  rose: {
    iconBg: "bg-danger-500/10",
    iconText: "text-danger-600",
    accent: "from-danger-500/0 to-danger-500/8",
  },
  amber: {
    iconBg: "bg-warning-500/10",
    iconText: "text-warning-600",
    accent: "from-warning-500/0 to-warning-500/8",
  },
};

const StatCard = ({
  title,
  value,
  icon,
  tone = "blue",
  subtitle,
}: StatCardProps) => {
  const t = toneClasses[tone];
  return (
    <Card hover className="group relative overflow-hidden p-5">
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          t.accent
        )}
      />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-slate-500">{title}</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-xs font-medium text-slate-400">{subtitle}</p>
          )}
        </div>
        <div
          className={clsx(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            t.iconBg,
            t.iconText
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
