import type { ReactNode } from "react";
import Card from "../ui/Card";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-emerald-100 p-4">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;