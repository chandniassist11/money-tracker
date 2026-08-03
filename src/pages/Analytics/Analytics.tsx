import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Scale,
  PiggyBank,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { useLoadAppData } from "../../store/useLoadAppData";
import { useFinanceSelectors } from "../../store/hooks";
import { useCurrency } from "../../store/useCurrency";
import { formatCurrency, currentMonth } from "../../lib/format";
import { useAppSelector } from "../../store";
import { chartTooltipStyle, chartAxisProps, chartGridProps } from "../../lib/chartConfig";

const Analytics = () => {
  useLoadAppData();
  const cur = useCurrency();
  const {
    totalIncome,
    totalExpense,
    last6Months,
    expenseByCategoryArray,
    accountBalances,
  } = useFinanceSelectors();
  const budgets = useAppSelector((s) => s.budgets.items);
  const transactions = useAppSelector((s) => s.transactions.items);

  const month = currentMonth();

  const cashFlowData = last6Months.map((m) => ({
    name: m.label,
    Income: m.income,
    Expense: m.expense,
    Net: m.income - m.expense,
  }));

  const incomeByCategory = useMemo(() => {
    const map: Record<string, { name: string; value: number; color: string }> = {};
    transactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        if (!map[t.category_id]) {
          map[t.category_id] = {
            name: t.category?.name ?? "Unknown",
            value: 0,
            color: t.category?.color ?? "#10b981",
          };
        }
        map[t.category_id].value += Number(t.amount);
      });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const budgetUtilization = useMemo(() => {
    const monthBudgets = budgets.filter((b) => b.month === month);
    return monthBudgets.map((b) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category_id === b.category_id &&
            t.date.slice(0, 7) === month
        )
        .reduce((s, t) => s + Number(t.amount), 0);
      const pct = Number(b.amount) > 0 ? Math.round((spent / Number(b.amount)) * 100) : 0;
      const cat = transactions.find((t) => t.category_id === b.category_id)?.category;
      return {
        name: cat?.name ?? "Budget",
        spent,
        budget: Number(b.amount),
        pct: Math.min(100, pct),
        fill: cat?.color ?? "#10b981",
      };
    });
  }, [budgets, transactions, month]);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  const accountDistribution = accountBalances.map((a) => ({
    name: a.name,
    value: Math.max(0, a.balance),
    fill: a.color,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Analytics</h2>
        <p className="text-sm text-slate-500">Insights into your financial activity</p>
      </div>

      {/* Summary */}
      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome, cur)}
          icon={<TrendingUp size={22} />}
          tone="emerald"
        />
        <StatCard
          title="Total Expense"
          value={formatCurrency(totalExpense, cur)}
          icon={<TrendingDown size={22} />}
          tone="rose"
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(netSavings, cur)}
          icon={<Scale size={22} />}
          tone={netSavings >= 0 ? "emerald" : "rose"}
          subtitle={`${savingsRate}% savings rate`}
        />
        <StatCard
          title="Cash Balance"
          value={formatCurrency(accountBalances.reduce((s, a) => s + a.balance, 0), cur)}
          icon={<Wallet size={22} />}
          tone="amber"
        />
      </div>

      {/* Cash flow */}
      <Card>
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="font-bold text-slate-800">Cash Flow Analysis</h3>
            <p className="text-xs text-slate-400">Monthly comparison</p>
          </div>
        </div>
        <div className="px-3 pb-4 pt-2">
          {cashFlowData.every((d) => d.Income === 0 && d.Expense === 0) ? (
            <EmptyState title="No data" description="Add transactions to see cash flow." />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={cashFlowData}>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="name" {...chartAxisProps} />
                <YAxis {...chartAxisProps} />
                <Tooltip formatter={(v) => formatCurrency(Number(v), cur)} contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
                <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Expense by category */}
        <Card>
          <div className="mb-4 border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-slate-800">Expense Breakdown</h3>
            <p className="text-xs text-slate-400">By category, this month</p>
          </div>
          <div className="px-3 pb-4 pt-2">
            {expenseByCategoryArray.length === 0 ? (
              <EmptyState title="No expenses this month" />
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
                    {expenseByCategoryArray.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v), cur)} contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Income by category */}
        <Card>
          <div className="mb-4 border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-slate-800">Income Sources</h3>
            <p className="text-xs text-slate-400">By category, all time</p>
          </div>
          <div className="px-3 pb-4 pt-2">
            {incomeByCategory.length === 0 ? (
              <EmptyState title="No income recorded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeByCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    cornerRadius={6}
                  >
                    {incomeByCategory.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v), cur)} contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Net savings trend */}
      <Card>
        <div className="mb-4 border-b border-slate-100 px-5 py-4">
          <h3 className="font-bold text-slate-800">Monthly Net Savings Trend</h3>
          <p className="text-xs text-slate-400">Income minus expense</p>
        </div>
        <div className="px-3 pb-4 pt-2">
          {cashFlowData.every((d) => d.Net === 0) ? (
            <EmptyState title="No data" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={cashFlowData}>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="name" {...chartAxisProps} />
                <YAxis {...chartAxisProps} />
                <Tooltip formatter={(v) => formatCurrency(Number(v), cur)} contentStyle={chartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="Net"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Budget utilization radial */}
        <Card>
          <div className="mb-4 border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-slate-800">Budget Utilization</h3>
            <p className="text-xs text-slate-400">This month</p>
          </div>
          <div className="px-3 pb-4 pt-2">
            {budgetUtilization.length === 0 ? (
              <EmptyState
                title="No budgets set"
                description="Set budgets to see utilization."
                icon={<PiggyBank size={32} />}
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart
                  innerRadius="20%"
                  outerRadius="100%"
                  data={budgetUtilization}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar background dataKey="pct" cornerRadius={6} />
                  <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v) => `${v}%`}
                    contentStyle={chartTooltipStyle}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Account distribution */}
        <Card>
          <div className="mb-4 border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-slate-800">Account Distribution</h3>
            <p className="text-xs text-slate-400">By balance</p>
          </div>
          <div className="px-3 pb-4 pt-2">
            {accountDistribution.length === 0 ? (
              <EmptyState title="No accounts" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accountDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    cornerRadius={6}
                  >
                    {accountDistribution.map((e, i) => (
                      <Cell key={i} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v), cur)} contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
