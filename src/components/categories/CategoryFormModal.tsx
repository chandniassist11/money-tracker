import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../store";
import {
  createCategory,
  updateCategory,
} from "../../store/slices/categoriesSlice";
import type { Category, CategoryType } from "../../types";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../../constants/data";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import { getIcon } from "../../lib/icons";
import toast from "react-hot-toast";

interface FormValues {
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
}

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  editing?: Category | null;
  defaultType?: CategoryType;
}

const CategoryFormModal = ({
  open,
  onClose,
  editing,
  defaultType = "expense",
}: CategoryFormModalProps) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const selectedColor = watch("color");
  const selectedIcon = watch("icon");

  useEffect(() => {
    if (open) {
      reset({
        name: editing?.name ?? "",
        type: editing?.type ?? defaultType,
        color: editing?.color ?? CATEGORY_COLORS[0],
        icon: editing?.icon ?? CATEGORY_ICONS[0],
      });
    }
  }, [open, editing, defaultType, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (editing) {
        await dispatch(
          updateCategory({
            id: editing.id,
            name: values.name,
            type: values.type,
            color: values.color,
            icon: values.icon,
          })
        ).unwrap();
        toast.success("Category updated");
      } else {
        await dispatch(
          createCategory({
            name: values.name,
            type: values.type,
            color: values.color,
            icon: values.icon,
          })
        ).unwrap();
        toast.success("Category created");
      }
      onClose();
    } catch {
      toast.error("Failed to save category");
    }
  };

  const PreviewIcon = getIcon(selectedIcon ?? CATEGORY_ICONS[0]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Category" : "Add Category"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Category Name"
          placeholder="e.g. Groceries"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />

        <Select
          label="Type"
          {...register("type")}
          options={[
            { value: "expense", label: "Expense" },
            { value: "income", label: "Income" },
          ]}
        />

        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => reset({ ...watch(), color: c })}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  selectedColor === c
                    ? "border-slate-800 ring-2 ring-slate-200"
                    : "border-white"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700">
            Icon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {CATEGORY_ICONS.map((name) => {
              const Icon = getIcon(name);
              const active = selectedIcon === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => reset({ ...watch(), icon: name })}
                  className={`flex h-10 items-center justify-center rounded-lg border transition ${
                    active
                      ? "border-primary-400 bg-primary-50 text-primary-600 ring-2 ring-primary-500/20"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1 text-xs text-slate-400">Preview</p>
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${selectedColor}1a`,
                color: selectedColor,
              }}
            >
              <PreviewIcon size={16} />
            </div>
            <span className="font-bold text-slate-700">
              {watch("name") || "Category name"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {editing ? "Save Changes" : "Add Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
