import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Category } from "../../types";
import { loadCollection, saveCollection, uid, nowISO } from "../../lib/localStorage";

const SEED_CATEGORIES: Category[] = [
  { id: "cat-salary", name: "Salary", type: "income", color: "#10b981", icon: "Banknote", created_at: nowISO() },
  { id: "cat-freelance", name: "Freelancing", type: "income", color: "#06b6d4", icon: "Laptop", created_at: nowISO() },
  { id: "cat-business", name: "Business", type: "income", color: "#0ea5e9", icon: "Briefcase", created_at: nowISO() },
  { id: "cat-invest", name: "Investments", type: "income", color: "#14b8a6", icon: "TrendingUp", created_at: nowISO() },
  { id: "cat-food", name: "Food", type: "expense", color: "#f97316", icon: "Utensils", created_at: nowISO() },
  { id: "cat-shopping", name: "Shopping", type: "expense", color: "#ec4899", icon: "ShoppingBag", created_at: nowISO() },
  { id: "cat-transport", name: "Transportation", type: "expense", color: "#3b82f6", icon: "Car", created_at: nowISO() },
  { id: "cat-health", name: "Healthcare", type: "expense", color: "#ef4444", icon: "HeartPulse", created_at: nowISO() },
  { id: "cat-entertain", name: "Entertainment", type: "expense", color: "#a855f7", icon: "Clapperboard", created_at: nowISO() },
  { id: "cat-bills", name: "Bills", type: "expense", color: "#f43f5e", icon: "Receipt", created_at: nowISO() },
  { id: "cat-education", name: "Education", type: "expense", color: "#6366f1", icon: "GraduationCap", created_at: nowISO() },
  { id: "cat-other", name: "Other", type: "expense", color: "#64748b", icon: "Package", created_at: nowISO() },
];

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk("categories/fetchAll", async () => {
  const existing = loadCollection<Category>("categories");
  if (existing.length === 0) {
    saveCollection("categories", SEED_CATEGORIES);
    return SEED_CATEGORIES;
  }
  return existing;
});

export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload: Omit<Category, "id" | "created_at">) => {
    return { ...payload, id: uid(), created_at: nowISO() } as Category;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, ...payload }: Partial<Category> & { id: string }) => {
    return { id, ...payload } as Category;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string) => id
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
        saveCollection("categories", state.items);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload };
          saveCollection("categories", state.items);
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
        saveCollection("categories", state.items);
      });
  },
});

export default categoriesSlice.reducer;
