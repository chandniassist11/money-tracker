import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Transaction, TransactionWithDetails } from "../../types";
import { supabase } from "../../lib/supabaseClient";

interface TransactionsState {
  items: TransactionWithDetails[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, category:categories(*), account:accounts(*)")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as TransactionWithDetails[];
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (
    payload: Omit<Transaction, "id" | "created_at">
  ): Promise<TransactionWithDetails> => {
    const { data, error } = await supabase
      .from("transactions")
      .insert(payload)
      .select("*, category:categories(*), account:accounts(*)")
      .single();
    if (error) throw new Error(error.message);
    return data as unknown as TransactionWithDetails;
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({
    id,
    ...payload
  }: Partial<Omit<Transaction, "created_at">> & { id: string }) => {
    const { data, error } = await supabase
      .from("transactions")
      .update(payload)
      .eq("id", id)
      .select("*, category:categories(*), account:accounts(*)")
      .single();
    if (error) throw new Error(error.message);
    return data as unknown as TransactionWithDetails;
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return id;
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load transactions";
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default transactionsSlice.reducer;
