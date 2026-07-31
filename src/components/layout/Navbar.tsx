import { Menu, Search, UserCircle2 } from "lucide-react";
import { usePageTitle } from "../../hooks/usePageTitle";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const title = usePageTitle();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800 sm:text-xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search..."
            className="w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-40"
          />
        </div>
        <UserCircle2 size={34} className="text-slate-400" />
      </div>
    </header>
  );
};

export default Navbar;
