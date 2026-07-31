import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Budget } from "../../types";
import { loadCollection, saveCollection, uid, nowISO } from "../../lib/localStorage";

interface BudgetsState {
  items: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk("budgets/fetchAll", async () =>
  loadCollection<Budget>("budgets")
);

export const upsertBudget = createAsyncThunk(
  "budgets/upsert",
  async (payload: {
    id?: string;
    category_id: string;
    amount: number;
    month: string;
  }) => {
    const existing = loadCollection<Budget>("budgets");
    const dup = existing.find(
      (b) =>
        b.category_id === payload.category_id &&
        b.month === payload.month &&
        b.id !== payload.id
    );
    if (dup) throw new Error("A budget already exists for this category this month");
    return {
      id: payload.id ?? uid(),
      category_id: payload.category_id,
      amount: payload.amount,
      month: payload.month,
      created_at: nowISO(),
    } as Budget;
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/delete",
  async (id: string) => id
);

const budgetsSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(upsertBudget.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        else state.items.unshift(action.payload);
        saveCollection("budgets", state.items);
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
        saveCollection("budgets", state.items);
      });
  },
});

export default budgetsSlice.reducer;
