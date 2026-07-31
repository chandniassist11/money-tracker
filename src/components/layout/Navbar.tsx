import { Bell, Search, UserCircle2 } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-700">
        Dashboard
      </h1>

      <div className="flex items-center gap-5">
        <Search className="cursor-pointer" />

        <Bell className="cursor-pointer" />

        <UserCircle2 size={34} />
      </div>
    </header>
  );
};

export default Navbar;