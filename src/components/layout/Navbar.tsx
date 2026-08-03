import { Menu, Bell, Search } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-slate-800 sm:text-lg">
            {title}
          </h1>
          <p className="hidden text-xs font-medium text-slate-400 sm:block">
            {today}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-32 bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
          />
        </div>
        <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-500 text-sm font-bold text-white shadow-md shadow-primary-500/20">
          U
        </div>
      </div>
    </header>
  );
};

export default Navbar;
