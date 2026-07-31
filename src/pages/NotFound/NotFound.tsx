import { Link } from "react-router-dom";
import { Hop as Home, Compass } from "lucide-react";
import Button from "../../components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200/50 p-5 text-slate-400 ring-1 ring-slate-200/60">
          <Compass size={48} />
        </div>
      </div>
      <h1 className="mt-6 bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-7xl font-extrabold text-transparent">
        404
      </h1>
      <p className="mt-2 text-lg font-bold text-slate-700">Page not found</p>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>
          <Home size={18} /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
