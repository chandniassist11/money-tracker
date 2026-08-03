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
  { value: "cash", label: "Cash", color: "#0d9488" },
  { value: "bank", label: "Bank Account", color: "#2563eb" },
  { value: "credit_card", label: "Credit Card", color: "#dc2626" },
  { value: "upi", label: "UPI", color: "#7c3aed" },
  { value: "wallet", label: "Digital Wallet", color: "#ea580c" },
] as const;

export const CATEGORY_COLORS = [
  "#2563eb",
  "#0d9488",
  "#7c3aed",
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#16a34a",
  "#0891b2",
  "#4f46e5",
  "#db2777",
  "#9333ea",
  "#059669",
  "#ca8a04",
  "#f43f5e",
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
