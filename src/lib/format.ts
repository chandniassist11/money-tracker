import type { Currency } from "../types";

export const formatCurrency = (value: number, currency: Currency): string => {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  const sign = value < 0 ? "-" : "";
  return `${sign}${currency.symbol}${formatted}`;
};

export const formatMonth = (month: string): string => {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export const formatShortDate = (date: string): string => {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const toInputDate = (date: string): string => date;

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const currentMonth = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
