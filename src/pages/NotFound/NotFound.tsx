import { Link } from "react-router-dom";
import { Hop as Home, Compass } from "lucide-react";
import Button from "../../components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-2xl bg-slate-100 p-5 text-slate-400">
        <Compass size={48} />
      </div>
      <h1 className="mt-6 text-6xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-lg font-medium text-slate-600">Page not found</p>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
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
