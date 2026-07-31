import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, Folder, PiggyBank, ChartBar as BarChart3, Settings, X, TrendingUp } from "lucide-react";
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

const Sidebar = ({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(mobileOpen), [mobileOpen]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="rounded-xl bg-emerald-500 p-2 text-white">
            <TrendingUp size={22} />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <span className="text-lg font-bold text-slate-800">Money Tracker</span>
            <button
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )
                }
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
