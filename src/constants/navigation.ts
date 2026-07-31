import { LayoutDashboard, Receipt, Wallet, Folder, PiggyBank, ChartBar as BarChart3, Settings } from "lucide-react";

import type { NavigationItem } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: Receipt,
  },
  {
    name: "Accounts",
    path: "/accounts",
    icon: Wallet,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: Folder,
  },
  {
    name: "Budget",
    path: "/budget",
    icon: PiggyBank,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];