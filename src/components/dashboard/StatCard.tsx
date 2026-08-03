import type { ReactNode } from "react";
import Card from "../ui/Card";
import clsx from "clsx";

type Tone = "emerald" | "blue" | "rose" | "amber";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  tone?: Tone;
  subtitle?: string;
  trend?: "up" | "down" | "flat";
}

const toneClasses: Record<Tone, { iconBg: string; iconText: string; accent: string }> = {
  emerald: {
    iconBg: "bg-brand-50",
    iconText: "text-brand-600",
    accent: "from-brand-500/0 to-brand-500/8",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    accent: "from-blue-500/0 to-blue-500/8",
  },
  rose: {
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    accent: "from-rose-500/0 to-rose-500/8",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    accent: "from-amber-500/0 to-amber-500/8",
  },
};

const StatCard = ({
  title,
  value,
  icon,
  tone = "emerald",
  subtitle,
}: StatCardProps) => {
  const t = toneClasses[tone];
  return (
    <Card hover className="group relative overflow-hidden p-5">
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-400 group-hover:opacity-100",
          t.accent
        )}
      />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-slate-500">{title}</p>
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
