import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Folder,
  PiggyBank,
  ChartBar as BarChart3,
  Settings,
  X,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: Receipt },
  { name: "Accounts", path: "/accounts", icon: Wallet },
  { name: "Categories", path: "/categories", icon: Folder },
  { name: "Budget", path: "/budget", icon: PiggyBank },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = ({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(mobileOpen), [mobileOpen]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm animate-fade-in lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <Sparkles size={22} />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <span className="block text-lg font-extrabold tracking-tight text-slate-800">
                Money Tracker
              </span>
              <span className="text-xs font-medium text-emerald-600">
                Personal Finance
              </span>
            </div>
            <button
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 lg:hidden"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-4">
          <p className="px-3 pb-2 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                    "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute -left-4 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-emerald-500" />
                    )}
                    <Icon
                      size={20}
                      className={clsx(
                        "transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
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
        <div className="px-4 pb-6 pt-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 ring-1 ring-slate-200/60">
            <p className="text-xs font-semibold text-slate-600">
              Track. Budget. Save.
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Your data is stored locally on this device.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
