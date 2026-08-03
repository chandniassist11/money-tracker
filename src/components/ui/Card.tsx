import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = ({ children, className, hover = false }: CardProps) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-200/40",
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-lg hover:shadow-slate-200/60",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
