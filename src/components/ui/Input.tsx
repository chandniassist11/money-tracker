import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-emerald-500",
        className
      )}
      {...props}
    />
  );
};

export default Input;