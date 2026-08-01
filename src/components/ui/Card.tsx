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
        "p-10 rounded-2xl border border-slate-200/80 bg-white shadow-md",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;