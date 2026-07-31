import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store";
import { upsertBudget } from "../../store/slices/budgetsSlice";
import type { Budget } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import { formatMonth } from "../../lib/format";
import toast from "react-hot-toast";

interface FormValues {
  category_id: string;
  amount: string;
}

interface BudgetFormModalProps {
  open: boolean;
  onClose: () => void;
  editing?: Budget | null;
  month: string;
}

const BudgetFormModal = ({
  open,
  onClose,
  editing,
  month,
}: BudgetFormModalProps) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.items);
  const budgets = useAppSelector((s) => s.budgets.items);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const availableCategories = categories.filter((c) => c.type === "expense");

  useEffect(() => {
    if (open) {
      reset({
        category_id: editing?.category_id ?? "",
        amount: editing ? String(editing.amount) : "",
      });
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: FormValues) => {
    const existing = budgets.find(
      (b) => b.category_id === values.category_id && b.month === month && b.id !== editing?.id
    );
    if (existing) {
      toast.error("A budget already exists for this category this month");
      return;
    }
    try {
      await dispatch(
        upsertBudget({
          id: editing?.id,
          category_id: values.category_id,
          amount: Number(values.amount),
          month,
        })
      ).unwrap();
      toast.success(editing ? "Budget updated" : "Budget created");
      onClose();
    } catch {
      toast.error("Failed to save budget");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Budget" : "Add Budget"}
    >
      <p className="mb-4 text-sm text-slate-500">
        Budget for <span className="font-medium text-slate-700">{formatMonth(month)}</span>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Category"
          placeholder="Select expense category"
          {...register("category_id", { required: "Select a category" })}
          error={errors.category_id?.message}
          options={availableCategories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Input
          label="Budget Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Must be greater than 0" },
          })}
          error={errors.amount?.message}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {editing ? "Save Changes" : "Add Budget"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetFormModal;
