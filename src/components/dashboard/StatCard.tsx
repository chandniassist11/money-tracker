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
}

const toneClasses: Record<
  Tone,
  { gradient: string; ring: string; text: string }
> = {
  emerald: {
    gradient: "from-emerald-400 to-emerald-600",
    ring: "shadow-emerald-500/30",
    text: "text-emerald-600",
  },
  blue: {
    gradient: "from-blue-400 to-blue-600",
    ring: "shadow-blue-500/30",
    text: "text-blue-600",
  },
  rose: {
    gradient: "from-rose-400 to-rose-600",
    ring: "shadow-rose-500/30",
    text: "text-rose-600",
  },
  amber: {
    gradient: "from-amber-400 to-amber-600",
    ring: "shadow-amber-500/30",
    text: "text-amber-600",
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
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          t.gradient
        )}
      />
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-800">
            {value}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-xs font-medium text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            t.gradient,
            t.ring
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
