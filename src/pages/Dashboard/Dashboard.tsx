import StatCard from "../../components/dashboard/StatCard";
import { Wallet } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value="₹52,450"
          icon={<Wallet size={28} />}
        />

        <StatCard
          title="Income"
          value="₹78,200"
          icon={<Wallet size={28} />}
        />

        <StatCard
          title="Expense"
          value="₹25,750"
          icon={<Wallet size={28} />}
        />

        <StatCard
          title="Budget Left"
          value="₹18,400"
          icon={<Wallet size={28} />}
        />
      </div>
    </div>
  );
};

export default Dashboard;