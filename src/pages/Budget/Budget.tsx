import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Target, TrendingDown, PiggyBank } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ProgressBar from "../../components/ui/ProgressBar";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import BudgetFormModal from "../../components/budget/BudgetFormModal";
import { useAppDispatch, useAppSelector } from "../../store";
import { deleteBudget } from "../../store/slices/budgetsSlice";
import { useLoadAppData } from "../../store/useLoadAppData";
import { useCurrency } from "../../store/useCurrency";
import { formatCurrency, formatMonth, currentMonth } from "../../lib/format";
import { getIcon } from "../../lib/icons";
import type { Budget } from "../../types";
import toast from "react-hot-toast";

const shiftMonth = (month: string, delta: number): string => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const BudgetPage = () => {
  useLoadAppData();
  const dispatch = useAppDispatch();
  const cur = useCurrency();
  const budgets = useAppSelector((s) => s.budgets.items);
  const categories = useAppSelector((s) => s.categories.items);
  const transactions = useAppSelector((s) => s.transactions.items);

  const [month, setMonth] = useState(currentMonth());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const monthBudgets = useMemo(
    () => budgets.filter((b) => b.month === month),
    [budgets, month]
  );

  const spendingByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense" && t.date.slice(0, 7) === month)
      .forEach((t) => {
        map[t.category_id] = (map[t.category_id] ?? 0) + Number(t.amount);
      });
    return map;
  }, [transactions, month]);

  const totalBudget = monthBudgets.reduce((s, b) => s + Number(b.amount), 0);
  const totalSpent = monthBudgets.reduce(
    (s, b) => s + (spendingByCategory[b.category_id] ?? 0),
    0
  );
  const totalLeft = Math.max(0, totalBudget - totalSpent);
  const overallPct =
    totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const isCurrentMonth = month === currentMonth();

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteBudget(deleteId)).unwrap();
      toast.success("Budget deleted");
    } catch {
      toast.error("Failed to delete budget");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMonth((m) => shiftMonth(m, -1))}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-[160px] text-center">
            <h2 className="text-xl font-bold text-slate-800">{formatMonth(month)}</h2>
            {!isCurrentMonth && (
              <button
                onClick={() => setMonth(currentMonth())}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Back to today
              </button>
            )}
          </div>
          <button
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Budget
        </Button>
      </div>

      {/* Summary */}
      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card hover className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Target size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Budget</p>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">
                {formatCurrency(totalBudget, cur)}
              </p>
            </div>
          </div>
        </Card>
        <Card hover className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Spent</p>
              <p className="text-2xl font-extrabold tracking-tight text-rose-600">
                {formatCurrency(totalSpent, cur)}
              </p>
            </div>
          </div>
        </Card>
        <Card hover className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <PiggyBank size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Remaining</p>
              <p className="text-2xl font-extrabold tracking-tight text-emerald-600">
                {formatCurrency(totalLeft, cur)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Overall Progress</h3>
            <p className="text-xs text-slate-400">Across all category budgets</p>
          </div>
          <Badge tone={overallPct >= 100 ? "expense" : overallPct >= 80 ? "warning" : "neutral"}>
            {overallPct}% used
          </Badge>
        </div>
        <ProgressBar value={totalSpent} max={totalBudget} className="h-3.5" />
      </Card>

      {/* Per-category budgets */}
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800">Category Budgets</h3>
          <p className="text-xs text-slate-400">Spending limits for {formatMonth(month)}</p>
        </div>
        {monthBudgets.length === 0 ? (
          <EmptyState
            icon={<PiggyBank size={32} />}
            title="No budgets for this month"
            description="Set spending limits for your expense categories to track progress."
            action={
              <Button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                <Plus size={18} /> Add Budget
              </Button>
            }
          />
        ) : (
          <div className="stagger space-y-3">
            {monthBudgets.map((b) => {
              const category = categories.find((c) => c.id === b.category_id);
              const spent = spendingByCategory[b.category_id] ?? 0;
              const pct =
                Number(b.amount) > 0
                  ? Math.round((spent / Number(b.amount)) * 100)
                  : 0;
              const over = spent > Number(b.amount);
              const Icon = getIcon(category?.icon ?? "Wallet");
              return (
                <div
                  key={b.id}
                  className="group rounded-2xl border border-slate-200/80 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${category?.color ?? "#64748b"}1a`,
                        color: category?.color ?? "#64748b",
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">
                        {category?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(spent, cur)} of {formatCurrency(Number(b.amount), cur)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          over ? "text-rose-600" : "text-slate-700"
                        }`}
                      >
                        {pct}%
                      </span>
                      <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setEditing(b);
                            setModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <ProgressBar
                    value={spent}
                    max={Number(b.amount)}
                    className="mt-3"
                    colorClass={over ? "bg-rose-500" : "bg-gradient-to-r from-emerald-400 to-emerald-500"}
                  />
                  {over && (
                    <p className="mt-2 text-xs font-medium text-rose-500">
                      Over budget by {formatCurrency(spent - Number(b.amount), cur)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <BudgetFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        month={month}
      />

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete budget?"
        size="sm"
      >
        <p className="text-sm leading-relaxed text-slate-600">
          This budget will be removed for {formatMonth(month)}.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetPage;
