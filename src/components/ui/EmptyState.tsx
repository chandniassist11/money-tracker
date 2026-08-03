import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center animate-fade-in">
      <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-accent-500/10 p-4 text-primary-300 ring-1 ring-primary-100">
        {icon ?? <Inbox size={32} />}
      </div>
      <h3 className="text-base font-bold text-slate-700">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
};

export default EmptyState;
