import { Menu, Search, Bell } from "lucide-react";
import { usePageTitle } from "../../hooks/usePageTitle";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const title = usePageTitle();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-slate-400 sm:block">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 sm:flex">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search..."
            className="w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-40"
          />
        </div>
        <button className="relative rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-sm">
          U
        </div>
      </div>
    </header>
  );
};

export default Navbar;
