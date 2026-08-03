import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../store";
import { createAccount, updateAccount } from "../../store/slices/accountsSlice";
import type { Account, AccountType } from "../../types";
import { ACCOUNT_TYPES } from "../../constants/data";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";

interface FormValues {
  name: string;
  type: AccountType;
  initial_balance: string;
  color: string;
}

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  editing?: Account | null;
}

const AccountFormModal = ({ open, onClose, editing }: AccountFormModalProps) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const selectedColor = watch("color");
  const selectedType = watch("type");

  useEffect(() => {
    if (open) {
      reset({
        name: editing?.name ?? "",
        type: editing?.type ?? "cash",
        initial_balance: editing ? String(editing.initial_balance) : "0",
        color: editing?.color ?? "#2563eb",
      });
    }
  }, [open, editing, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      type: values.type,
      initial_balance: Number(values.initial_balance),
      color: values.color,
    };
    try {
      if (editing) {
        await dispatch(updateAccount({ id: editing.id, ...payload })).unwrap();
        toast.success("Account updated");
      } else {
        await dispatch(createAccount(payload)).unwrap();
        toast.success("Account created");
      }
      onClose();
    } catch {
      toast.error("Failed to save account");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Account" : "Add Account"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Account Name"
          placeholder="e.g. HDFC Savings"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />

        <Select
          label="Account Type"
          {...register("type")}
          options={ACCOUNT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
        />

        <Input
          label="Initial Balance"
          type="number"
          step="0.01"
          {...register("initial_balance", {
            required: "Required",
            min: { value: 0, message: "Cannot be negative" },
          })}
          error={errors.initial_balance?.message}
        />

        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCOUNT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  reset({
                    ...watch(),
                    color: t.color,
                    type: t.value as AccountType,
                  });
                }}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  selectedColor === t.color
                    ? "border-slate-800 ring-2 ring-slate-200"
                    : "border-white"
                }`}
                style={{ backgroundColor: t.color }}
                title={t.label}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {ACCOUNT_TYPES.find((t) => t.value === selectedType)?.label}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {editing ? "Save Changes" : "Add Account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AccountFormModal;
