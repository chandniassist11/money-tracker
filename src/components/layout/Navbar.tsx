import { Menu, Bell } from "lucide-react";
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
    <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/60 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-200/60 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
            {title}
          </h1>
          <p className="hidden text-xs text-slate-400 sm:block">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-700">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-md shadow-brand-500/20">
          U
        </div>
      </div>
    </header>
  );
};

export default Navbar;
