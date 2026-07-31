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

const toneClasses: Record<Tone, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  rose: { bg: "bg-rose-100", text: "text-rose-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
};

const StatCard = ({ title, value, icon, tone = "emerald", subtitle }: StatCardProps) => {
  const t = toneClasses[tone];
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
            {value}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={clsx("rounded-xl p-3", t.bg, t.text)}>{icon}</div>
      </div>
    </Card>
  );
};

export default StatCard;
