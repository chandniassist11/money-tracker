import { useMemo } from "react";
import { useAppSelector } from "./index";
import { currentMonth } from "../lib/format";

export const useFinanceSelectors = () => {
  const transactions = useAppSelector((s) => s.transactions.items);
  const accounts = useAppSelector((s) => s.accounts.items);
  const budgets = useAppSelector((s) => s.budgets.items);
  const monthBudget = useAppSelector((s) => s.settings.monthBudget);

  return useMemo(() => {
    const month = currentMonth();

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalBalance =
      accounts.reduce((sum, a) => sum + Number(a.initial_balance), 0) +
      totalIncome -
      totalExpense;

    const monthExpenses = transactions.filter((t) => {
      const tMonth = t.date.slice(0, 7);
      return t.type === "expense" && tMonth === month;
    });
    const monthExpenseTotal = monthExpenses.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    const monthBudgets = budgets.filter((b) => b.month === month);
    const allocatedBudget =
      monthBudgets.reduce((sum, b) => sum + Number(b.amount), 0) ||
      monthBudget;
    const budgetLeft = Math.max(0, allocatedBudget - monthExpenseTotal);
    const budgetUsedPct =
      allocatedBudget > 0
        ? Math.min(100, Math.round((monthExpenseTotal / allocatedBudget) * 100))
        : 0;

    const recentTransactions = transactions.slice(0, 6);

    const expenseByCategory = monthExpenses.reduce<
      Record<string, { name: string; value: number; color: string }>
    >((acc, t) => {
      const key = t.category_id;
      if (!acc[key]) {
        acc[key] = {
          name: t.category?.name ?? "Unknown",
          value: 0,
          color: t.category?.color ?? "#64748b",
        };
      }
      acc[key].value += Number(t.amount);
      return acc;
    }, {});

    const expenseByCategoryArray = Object.values(expenseByCategory).sort(
      (a, b) => b.value - a.value
    );

    const accountBalances = accounts.map((a) => {
      const acctTx = transactions.filter((t) => t.account_id === a.id);
      const inc = acctTx
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0);
      const exp = acctTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0);
      return {
        ...a,
        balance: Number(a.initial_balance) + inc - exp,
      };
    });

    const last6Months = (() => {
      const months: { label: string; key: string; income: number; expense: number }[] = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("en-US", { month: "short" });
        const inc = transactions
          .filter((t) => t.type === "income" && t.date.slice(0, 7) === key)
          .reduce((s, t) => s + Number(t.amount), 0);
        const exp = transactions
          .filter((t) => t.type === "expense" && t.date.slice(0, 7) === key)
          .reduce((s, t) => s + Number(t.amount), 0);
        months.push({ label, key, income: inc, expense: exp });
      }
      return months;
    })();

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      monthExpenseTotal,
      budgetLeft,
      budgetUsedPct,
      allocatedBudget,
      recentTransactions,
      expenseByCategoryArray,
      accountBalances,
      last6Months,
      monthExpenses,
    };
  }, [transactions, accounts, budgets, monthBudget]);
};
