import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Folder } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import CategoryFormModal from "../../components/categories/CategoryFormModal";
import { useAppDispatch, useAppSelector } from "../../store";
import { deleteCategory } from "../../store/slices/categoriesSlice";
import { useLoadAppData } from "../../store/useLoadAppData";
import { getIcon } from "../../lib/icons";
import type { Category, CategoryType } from "../../types";
import toast from "react-hot-toast";

const Categories = () => {
  useLoadAppData();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.items);
  const transactions = useAppSelector((s) => s.transactions.items);

  const [tab, setTab] = useState<CategoryType>("expense");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const usageCount = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach((t) => {
      map[t.category_id] = (map[t.category_id] ?? 0) + 1;
    });
    return map;
  }, [transactions]);

  const filtered = useMemo(() => {
    return categories
      .filter((c) => c.type === tab)
      .filter((c) => (search ? c.name.toLowerCase().includes(search.toLowerCase()) : true));
  }, [categories, tab, search]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteCategory(deleteId)).unwrap();
      toast.success("Category deleted");
    } catch {
      toast.error("Cannot delete category in use by transactions");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Categories</h2>
          <p className="text-sm text-slate-500">Organize your transactions</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/40 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setTab("expense")}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                  tab === "expense"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Expense
              </button>
              <button
                onClick={() => setTab("income")}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                  tab === "income"
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Income
              </button>
            </div>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search categories..."
                icon={<Search size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Folder size={32} />}
            title="No categories found"
            description={`No ${tab} categories match. Create one to get started.`}
            action={
              <Button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                <Plus size={18} /> Add Category
              </Button>
            }
          />
        ) : (
          <div className="stagger grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
            {filtered.map((c) => {
              const Icon = getIcon(c.icon);
              const count = usageCount[c.id] ?? 0;
              return (
                <div
                  key={c.id}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 p-3.5 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${c.color}1a`, color: c.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">
                      {count} transaction{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditing(c);
                        setModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        defaultType={tab}
      />

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete category?"
        size="sm"
      >
        <p className="text-sm leading-relaxed text-slate-600">
          This category cannot be deleted if it has transactions using it.
          You may need to remove or reassign those transactions first.
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

export default Categories;
