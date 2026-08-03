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
        "rounded-2xl border border-slate-200/60 bg-white/90 shadow-sm shadow-slate-300/20",
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-200/30",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
