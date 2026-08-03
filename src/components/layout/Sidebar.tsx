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
  TrendingDown,
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

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
  useLoadAppData();
  const cur = useCurrency();
  const { totalIncome, totalExpense } = useFinanceSelectors();

  const netWorth = totalIncome - totalExpense;

  const content = (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/30">
          <Sparkles size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <span className="block text-[15px] font-extrabold tracking-tight text-white">
            Money Tracker
          </span>
          <span className="text-[11px] font-semibold text-primary-400">
            Personal Finance
          </span>
        </div>
        {onClose && (
          <button
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 lg:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Balance card */}
      <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-4 shadow-xl shadow-primary-900/40">
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary-200">
          Net Worth
        </p>
        <p className="mt-2 text-2xl font-extrabold tracking-tight text-white">
          {formatCurrency(netWorth, cur)}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white/10 px-2 py-1.5">
            <div className="flex items-center gap-1 text-[10px] font-medium text-primary-200">
              <TrendingUp size={11} /> Income
            </div>
            <p className="text-[11px] font-bold text-white">
              {formatCurrency(totalIncome, cur)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-2 py-1.5">
            <div className="flex items-center gap-1 text-[10px] font-medium text-primary-200">
              <TrendingDown size={11} /> Expense
            </div>
            <p className="text-[11px] font-bold text-white">
              {formatCurrency(totalExpense, cur)}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
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
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary-500/15 text-primary-400"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
                  )}
                  <Icon
                    size={18}
                    className={clsx(
                      "transition-transform duration-200 group-hover:scale-110",
                      isActive
                        ? "text-primary-400"
                        : "text-slate-500 group-hover:text-slate-300"
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
      <div className="px-4 pb-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
          <p className="text-xs font-bold text-slate-300">Track. Budget. Save.</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Your financial data stays on this device.
          </p>
        </div>
      </div>
    </div>
  );

  // Desktop: static full-height sidebar
  if (!onClose) {
    return <div className="h-full">{content}</div>;
  }

  // Mobile: slide-in drawer with backdrop
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 animate-fade-in bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
