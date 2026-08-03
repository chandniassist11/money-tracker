import clsx from "clsx";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  colorClass?: string;
  trackClass?: string;
}

const ProgressBar = ({
  value,
  max,
  className,
  colorClass,
  trackClass,
}: ProgressBarProps) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const over = pct >= 100;
  return (
    <div
      className={clsx(
        "h-2.5 w-full overflow-hidden rounded-full",
        trackClass ?? "bg-slate-200/70",
        className
      )}
    >
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-700 ease-out",
          colorClass ??
            (over
              ? "bg-danger-500"
              : "bg-gradient-to-r from-primary-400 to-accent-400")
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
