import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 min-w-[160px] text-center">
            {formatMonth(month)}
          </h2>
          <button
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
          >
            <ChevronRight size={18} />
          </button>
          {!isCurrentMonth && (
            <Button variant="ghost" size="sm" onClick={() => setMonth(currentMonth())}>
              Today
            </Button>
          )}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Total Budget</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">
            {formatCurrency(totalBudget, cur)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Spent</p>
          <p className="mt-1 text-2xl font-bold text-rose-600">
            {formatCurrency(totalSpent, cur)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Remaining</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {formatCurrency(totalLeft, cur)}
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Overall Progress</h3>
          <Badge tone={overallPct >= 100 ? "expense" : "neutral"}>
            {overallPct}% used
          </Badge>
        </div>
        <ProgressBar value={totalSpent} max={totalBudget} className="h-3" />
      </Card>

      {/* Per-category budgets */}
      <Card>
        <h3 className="mb-4 font-semibold text-slate-800">Category Budgets</h3>
        {monthBudgets.length === 0 ? (
          <EmptyState
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
          <div className="space-y-4">
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
                  className="group rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${category?.color ?? "#64748b"}1a`,
                        color: category?.color ?? "#64748b",
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800">
                        {category?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(spent, cur)} of {formatCurrency(Number(b.amount), cur)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
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
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
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
                    colorClass={over ? "bg-rose-500" : "bg-emerald-500"}
                  />
                  {over && (
                    <p className="mt-2 text-xs text-rose-500">
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
        <p className="text-sm text-slate-600">
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
