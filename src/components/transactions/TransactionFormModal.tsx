import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  createTransaction,
  updateTransaction,
} from "../../store/slices/transactionsSlice";
import type { Transaction, TransactionType } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import { todayISO } from "../../lib/format";

interface FormValues {
  type: TransactionType;
  amount: string;
  category_id: string;
  account_id: string;
  date: string;
  note: string;
}

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  editing?: Transaction | null;
}

const TransactionFormModal = ({
  open,
  onClose,
  editing,
}: TransactionFormModalProps) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.items);
  const accounts = useAppSelector((s) => s.accounts.items);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const type = watch("type");

  useEffect(() => {
    if (open) {
      reset({
        type: editing?.type ?? "expense",
        amount: editing ? String(editing.amount) : "",
        category_id: editing?.category_id ?? "",
        account_id: editing?.account_id ?? "",
        date: editing?.date ?? todayISO(),
        note: editing?.note ?? "",
      });
    }
  }, [open, editing, reset]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const payload = {
      type: values.type,
      amount: Number(values.amount),
      category_id: values.category_id,
      account_id: values.account_id,
      date: values.date,
      note: values.note || null,
    };
    if (editing) {
      await dispatch(updateTransaction({ id: editing.id, ...payload }));
    } else {
      await dispatch(createTransaction(payload));
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Transaction" : "Add Transaction"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setValue("type", "expense");
              setValue("category_id", "");
            }}
            className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
              type === "expense"
                ? "border-danger-400 bg-danger-500/10 text-danger-600 ring-2 ring-danger-500/20"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("type", "income");
              setValue("category_id", "");
            }}
            className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
              type === "income"
                ? "border-success-400 bg-success-500/10 text-success-600 ring-2 ring-success-500/20"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            Income
          </button>
        </div>

        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Must be greater than 0" },
          })}
          error={errors.amount?.message}
        />

        <Select
          label="Category"
          placeholder="Select category"
          {...register("category_id", { required: "Select a category" })}
          error={errors.category_id?.message}
          options={filteredCategories.map((c) => ({ value: c.id, label: c.name }))}
        />

        <Select
          label="Account"
          placeholder="Select account"
          {...register("account_id", { required: "Select an account" })}
          error={errors.account_id?.message}
          options={accounts.map((a) => ({ value: a.id, label: a.name }))}
        />

        <Input label="Date" type="date" {...register("date", { required: "Date is required" })} />

        <Input
          label="Note (optional)"
          placeholder="Add a note..."
          {...register("note")}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {editing ? "Save Changes" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
