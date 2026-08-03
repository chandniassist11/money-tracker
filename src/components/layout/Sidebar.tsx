import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Folder,
  PiggyBank,
  ChartBar as BarChart3,
  Settings as SettingsIcon,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import { useFinanceSelectors } from "../../store/hooks";
import { useCurrency } from "../../store/useCurrency";
import { useLoadAppData } from "../../store/useLoadAppData";
import { formatCurrency } from "../../lib/format";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: Receipt },
  { name: "Accounts", path: "/accounts", icon: Wallet },
  { name: "Categories", path: "/categories", icon: Folder },
  { name: "Budget", path: "/budget", icon: PiggyBank },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

const Sidebar = ({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  useLoadAppData();
  const cur = useCurrency();
  const { totalBalance, totalIncome, totalExpense } = useFinanceSelectors();

  useEffect(() => setOpen(mobileOpen), [mobileOpen]);

  const netWorth = totalIncome - totalExpense;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 animate-fade-in bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-[264px] transform flex-col bg-slate-900 transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 -right-10 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 -left-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />

        {/* Brand */}
        <div className="relative flex items-center gap-3 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/30">
            <Sparkles size={20} />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <span className="block text-[15px] font-bold tracking-tight text-white">
                Money Tracker
              </span>
              <span className="text-[11px] font-medium text-brand-400">
                Personal Finance
              </span>
            </div>
            <button
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 lg:hidden"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Balance card */}
        <div className="relative mx-4 mb-4 rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Net Worth
            </p>
            <TrendingUp size={14} className="text-brand-400" />
          </div>
          <p className="mt-1.5 text-xl font-extrabold tracking-tight text-white">
            {formatCurrency(netWorth, cur)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Balance: {formatCurrency(totalBalance, cur)}
          </p>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 space-y-0.5 px-3">
          <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-brand-500/20 to-transparent text-white"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-400" />
                    )}
                    <Icon
                      size={18}
                      className={clsx(
                        "transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative px-4 pb-5 pt-3">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/80 to-slate-900 p-4">
            <p className="text-xs font-semibold text-slate-300">
              Track. Budget. Save.
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              Your financial data stays on this device.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
