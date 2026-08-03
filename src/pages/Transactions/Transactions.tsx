import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ListFilter as Filter,
  Receipt,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import TransactionFormModal from "../../components/transactions/TransactionFormModal";
import { useAppDispatch, useAppSelector } from "../../store";
import { deleteTransaction } from "../../store/slices/transactionsSlice";
import { useLoadAppData } from "../../store/useLoadAppData";
import { useCurrency } from "../../store/useCurrency";
import { formatCurrency, formatShortDate } from "../../lib/format";
import { getIcon } from "../../lib/icons";
import type { Transaction } from "../../types";
import toast from "react-hot-toast";

const Transactions = () => {
  useLoadAppData();
  const dispatch = useAppDispatch();
  const cur = useCurrency();
  const transactions = useAppSelector((s) => s.transactions.items);
  const categories = useAppSelector((s) => s.categories.items);
  const accounts = useAppSelector((s) => s.accounts.items);

  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [accountFilter, setAccountFilter] = useState("");

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
    if (searchParams.get("new")) {
      searchParams.delete("new");
      setSearchParams(searchParams);
    }
  };

  if (searchParams.get("new") && !modalOpen) {
    openNew();
  }

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter && t.type !== typeFilter) return false;
      if (categoryFilter && t.category_id !== categoryFilter) return false;
      if (accountFilter && t.account_id !== accountFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchesNote = t.note?.toLowerCase().includes(q);
        const matchesCat = t.category?.name.toLowerCase().includes(q);
        const matchesAcc = t.account?.name.toLowerCase().includes(q);
        if (!matchesNote && !matchesCat && !matchesAcc) return false;
      }
      return true;
    });
  }, [transactions, search, typeFilter, categoryFilter, accountFilter]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteTransaction(deleteId)).unwrap();
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete transaction");
    }
    setDeleteId(null);
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setCategoryFilter("");
    setAccountFilter("");
  };

  const hasFilters = search || typeFilter || categoryFilter || accountFilter;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Transactions</h2>
          <p className="text-sm text-slate-500">
            {filtered.length} of {transactions.length} transactions
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus size={18} /> Add Transaction
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/40 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[200px] flex-1">
              <Input
                placeholder="Search by note, category, account..."
                icon={<Search size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-36">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                placeholder="All types"
                options={[
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ]}
              />
            </div>
            <div className="w-44">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="All categories"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
            </div>
            <div className="w-44">
              <Select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                placeholder="All accounts"
                options={accounts.map((a) => ({ value: a.id, label: a.name }))}
              />
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <Filter size={16} /> Clear
              </Button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Receipt size={32} />}
            title={hasFilters ? "No matching transactions" : "No transactions yet"}
            description={
              hasFilters
                ? "Try adjusting your filters."
                : "Add your first transaction to get started."
            }
            action={
              hasFilters ? undefined : (
                <Button onClick={openNew}>
                  <Plus size={18} /> Add Transaction
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Account</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5 text-right">Amount</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((t) => {
                  const Icon = getIcon(t.category?.icon ?? "Wallet");
                  return (
                    <tr key={t.id} className="group transition-colors hover:bg-slate-50/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                            style={{
                              backgroundColor: `${t.category?.color ?? "#64748b"}1a`,
                              color: t.category?.color ?? "#64748b",
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {t.category?.name ?? "Unknown"}
                            </p>
                            {t.note && (
                              <p className="truncate text-xs text-slate-400">
                                {t.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {t.account?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatShortDate(t.date)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={t.type === "income" ? "income" : "expense"}>
                          {t.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            t.type === "income" ? "text-brand-600" : "text-rose-600"
                          }`}
                        >
                          {t.type === "income" ? (
                            <ArrowUpRight size={14} />
                          ) : (
                            <ArrowDownRight size={14} />
                          )}
                          {formatCurrency(Number(t.amount), cur)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setEditing(t);
                              setModalOpen(true);
                            }}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(t.id)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <TransactionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
      />

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete transaction?"
        size="sm"
      >
        <p className="text-sm leading-relaxed text-slate-600">
          This action cannot be undone. The transaction will be permanently removed.
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

export default Transactions;
