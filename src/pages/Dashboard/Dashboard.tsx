import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles,
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
import { chartTooltipStyle, chartAxisProps, chartGridProps } from "../../lib/chartConfig";

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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 p-6 sm:p-8">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-white/10">
              <Sparkles size={13} /> {greeting}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {formatCurrency(totalBalance, cur)}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Your total balance across all accounts
            </p>
          </div>
          <Button
            onClick={() => navigate("/transactions?new=1")}
            className="bg-white text-slate-800 shadow-lg hover:bg-slate-100 hover:shadow-xl"
          >
            <Plus size={18} /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome, cur)}
          icon={<TrendingUp size={22} />}
          tone="emerald"
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
        <StatCard
          title="Net Savings"
          value={formatCurrency(totalIncome - totalExpense, cur)}
          icon={<Wallet size={22} />}
          tone="blue"
          subtitle={totalIncome > 0 ? `${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}% rate` : "—"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Income vs Expense</h3>
              <p className="text-xs text-slate-400">Last 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Expense
              </span>
            </div>
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
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="name" {...chartAxisProps} />
                <YAxis {...chartAxisProps} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v), cur)}
                  contentStyle={chartTooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="Income"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#gInc)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="Expense"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fill="url(#gExp)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="font-bold text-slate-800">Spending by Category</h3>
            <p className="text-xs text-slate-400">This month</p>
          </div>
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
                  cornerRadius={6}
                >
                  {expenseByCategoryArray.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v), cur)}
                  contentStyle={chartTooltipStyle}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Your latest activity</p>
          </div>
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
                <div
                  key={t.id}
                  className="group flex items-center gap-4 py-3 transition-colors hover:bg-slate-50/50"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${t.category?.color ?? "#64748b"}1a`,
                      color: t.category?.color ?? "#64748b",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {t.category?.name ?? "Unknown"}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {t.note || t.account?.name || formatShortDate(t.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
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
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      isIncome ? "bg-emerald-50" : "bg-rose-50"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight size={14} className="text-emerald-500" />
                    ) : (
                      <ArrowDownRight size={14} className="text-rose-500" />
                    )}
                  </div>
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
