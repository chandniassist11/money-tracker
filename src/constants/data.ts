import type { Currency } from "../types";

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
];

export const ACCOUNT_TYPES = [
  { value: "cash", label: "Cash", color: "#10b981" },
  { value: "bank", label: "Bank Account", color: "#3b82f6" },
  { value: "credit_card", label: "Credit Card", color: "#f43f5e" },
  { value: "upi", label: "UPI", color: "#a855f7" },
  { value: "wallet", label: "Digital Wallet", color: "#f97316" },
] as const;

export const CATEGORY_COLORS = [
  "#10b981",
  "#06b6d4",
  "#0ea5e9",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#64748b",
];

export const CATEGORY_ICONS = [
  "Wallet",
  "Banknote",
  "Laptop",
  "Briefcase",
  "TrendingUp",
  "Utensils",
  "ShoppingBag",
  "Car",
  "HeartPulse",
  "Clapperboard",
  "Receipt",
  "GraduationCap",
  "Package",
  "Gift",
  "Coffee",
  "Plane",
  "Home",
  "Zap",
];
