import clsx from "clsx";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  colorClass?: string;
}

const ProgressBar = ({
  value,
  max,
  className,
  colorClass,
}: ProgressBarProps) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const over = pct >= 100;
  return (
    <div className={clsx("h-2 w-full overflow-hidden rounded-full bg-slate-200", className)}>
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-500",
          colorClass ?? (over ? "bg-rose-500" : "bg-emerald-500")
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
