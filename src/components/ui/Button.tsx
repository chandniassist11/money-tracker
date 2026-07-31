import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

const Button = ({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "rounded-xl px-4 py-2 font-medium transition-all",
        variant === "primary"
          ? "bg-emerald-500 text-white hover:bg-emerald-600"
          : "border border-slate-300 bg-white hover:bg-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;