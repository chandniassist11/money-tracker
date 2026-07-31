import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useFinanceSelectors } from "../../store/hooks";
import { useCurrency } from "../../store/useCurrency";
import { formatCurrency, formatShortDate } from "../../lib/format";
import { useLoadAppData } from "../../store/useLoadAppData";
import { getIcon } from "../../lib/icons";

const Dashboard = () => {
  useLoadAppData();
  const navigate = useNavigate();
  const cur = useCurrency();
  const {
    totalBalance,
    totalIncome,
    totalExpense,
    budgetLeft,
    budgetUsedPct,
    allocatedBudget,
    recentTransactions,
    expenseByCategoryArray,
    last6Months,
  } = useFinanceSelectors();

  const areaData = last6Months.map((m) => ({
    name: m.label,
    Income: m.income,
    Expense: m.expense,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Welcome back 👋
          </h2>
          <p className="text-sm text-slate-500">
            Here&apos;s your financial overview.
          </p>
        </div>
        <Button onClick={() => navigate("/transactions?new=1")}>
          <Plus size={18} /> Add Transaction
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance, cur)}
          icon={<Wallet size={22} />}
          tone="emerald"
          subtitle="Across all accounts"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome, cur)}
          icon={<TrendingUp size={22} />}
          tone="blue"
          subtitle="All time"
        />
        <StatCard
          title="Total Expense"
          value={formatCurrency(totalExpense, cur)}
          icon={<TrendingDown size={22} />}
          tone="rose"
          subtitle="All time"
        />
        <StatCard
          title="Budget Left"
          value={formatCurrency(budgetLeft, cur)}
          icon={<PiggyBank size={22} />}
          tone="amber"
          subtitle={`${budgetUsedPct}% of ${formatCurrency(allocatedBudget, cur)} used`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Income vs Expense</h3>
            <span className="text-xs text-slate-400">Last 6 months</span>
          </div>
          {areaData.every((d) => d.Income === 0 && d.Expense === 0) ? (
            <EmptyState
              title="No data yet"
              description="Add transactions to see your income vs expense trend."
            />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v), cur)}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fill="url(#gInc)" />
                <Area type="monotone" dataKey="Expense" stroke="#f43f5e" strokeWidth={2} fill="url(#gExp)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold text-slate-800">Spending by Category</h3>
          {expenseByCategoryArray.length === 0 ? (
            <EmptyState
              title="No expenses this month"
              description="Your category breakdown will appear here."
            />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategoryArray}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {expenseByCategoryArray.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v), cur)} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/transactions")}>
            View all
          </Button>
        </div>
        {recentTransactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Start tracking by adding your first transaction."
            action={
              <Button onClick={() => navigate("/transactions?new=1")}>
                <Plus size={18} /> Add Transaction
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((t) => {
              const Icon = getIcon(t.category?.icon ?? "Wallet");
              const isIncome = t.type === "income";
              return (
                <div key={t.id} className="flex items-center gap-4 py-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${t.category?.color ?? "#64748b"}1a`,
                      color: t.category?.color ?? "#64748b",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {t.category?.name ?? "Unknown"}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {t.note || t.account?.name || formatShortDate(t.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(Number(t.amount), cur)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatShortDate(t.date)}
                    </p>
                  </div>
                  {isIncome ? (
                    <ArrowUpRight size={16} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={16} className="text-rose-500" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
