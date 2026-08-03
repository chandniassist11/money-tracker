import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, Folder, PiggyBank, ChartBar as BarChart3, Settings as SettingsIcon, X, Save as Waves, TrendingUp } from "lucide-react";
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
          className="fixed inset-0 z-30 animate-fade-in bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-[272px] transform flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/25">
            <Waves size={22} className="text-white" />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <span className="block text-[15px] font-extrabold tracking-tight text-slate-800">
                Money Tracker
              </span>
              <span className="text-[11px] font-semibold text-primary-500">
                Personal Finance
              </span>
            </div>
            <button
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 lg:hidden"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Balance card */}
        <div className="mx-4 mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-4 shadow-lg shadow-primary-500/20">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary-100">
              Net Worth
            </p>
            <TrendingUp size={15} className="text-primary-200" />
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-white">
            {formatCurrency(netWorth, cur)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1">
            <span className="text-[10px] font-medium text-primary-100">
              Balance
            </span>
            <span className="text-[11px] font-bold text-white">
              {formatCurrency(totalBalance, cur)}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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
                          ? "text-primary-500"
                          : "text-slate-400 group-hover:text-slate-600"
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
        <div className="px-4 pb-5 pt-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-bold text-slate-700">
              Track. Budget. Save.
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Your financial data stays on this device.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
