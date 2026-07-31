import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Budget } from "../../types";
import { supabase } from "../../lib/supabaseClient";

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

export const fetchBudgets = createAsyncThunk("budgets/fetchAll", async () => {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Budget[];
});

export const upsertBudget = createAsyncThunk(
  "budgets/upsert",
  async (payload: {
    id?: string;
    category_id: string;
    amount: number;
    month: string;
  }) => {
    const { data, error } = await supabase
      .from("budgets")
      .upsert(
        {
          id: payload.id,
          category_id: payload.category_id,
          amount: payload.amount,
          month: payload.month,
        },
        { onConflict: "category_id,month" }
      )
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Budget;
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/delete",
  async (id: string) => {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return id;
  }
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
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load budgets";
      })
      .addCase(upsertBudget.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        else state.items.unshift(action.payload);
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      });
  },
});

export default budgetsSlice.reducer;
