import { useMemo, useState } from "react";
import {
  Plus,
  Wallet,
  Banknote,
  CreditCard,
  Smartphone,
  PiggyBank,
  Pencil,
  Trash2,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import AccountFormModal from "../../components/accounts/AccountFormModal";
import { useAppDispatch } from "../../store";
import { deleteAccount } from "../../store/slices/accountsSlice";
import { useLoadAppData } from "../../store/useLoadAppData";
import { useCurrency } from "../../store/useCurrency";
import { useFinanceSelectors } from "../../store/hooks";
import { formatCurrency } from "../../lib/format";
import { ACCOUNT_TYPES } from "../../constants/data";
import type { Account, AccountType } from "../../types";
import toast from "react-hot-toast";

const typeIcons: Record<AccountType, typeof Wallet> = {
  cash: Wallet,
  bank: Banknote,
  credit_card: CreditCard,
  upi: Smartphone,
  wallet: PiggyBank,
};

const Accounts = () => {
  useLoadAppData();
  const dispatch = useAppDispatch();
  const cur = useCurrency();
  const { accountBalances } = useFinanceSelectors();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalBalance = useMemo(
    () => accountBalances.reduce((s, a) => s + a.balance, 0),
    [accountBalances]
  );

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteAccount(deleteId)).unwrap();
      toast.success("Account deleted");
    } catch {
      toast.error("Cannot delete account with existing transactions");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Accounts</h2>
          <p className="text-sm text-slate-500">
            Total balance: {formatCurrency(totalBalance, cur)}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Account
        </Button>
      </div>

      {accountBalances.length === 0 ? (
        <Card>
          <EmptyState
            title="No accounts yet"
            description="Create your first account to start tracking transactions."
            action={
              <Button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                <Plus size={18} /> Add Account
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accountBalances.map((a) => {
            const Icon = typeIcons[a.type] ?? Wallet;
            const typeMeta = ACCOUNT_TYPES.find((t) => t.value === a.type);
            return (
              <Card key={a.id} className="group relative overflow-hidden">
                <div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10"
                  style={{ backgroundColor: a.color }}
                />
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${a.color}1a`,
                      color: a.color,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditing(a);
                        setModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteId(a.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  {a.name}
                </h3>
                <p className="text-xs text-slate-400">{typeMeta?.label ?? a.type}</p>
                <div className="mt-4">
                  <p className="text-xs text-slate-400">Current Balance</p>
                  <p
                    className={`text-2xl font-bold ${
                      a.balance < 0 ? "text-rose-600" : "text-slate-800"
                    }`}
                  >
                    {formatCurrency(a.balance, cur)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AccountFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
      />

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete account?"
        size="sm"
      >
        <p className="text-sm text-slate-600">
          This account cannot be deleted if it has transactions linked to it.
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

export default Accounts;
