import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Transaction, TransactionWithDetails } from "../../types";
import { loadCollection, saveCollection, uid, nowISO } from "../../lib/localStorage";

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

const sortByDate = (items: TransactionWithDetails[]) =>
  [...items].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.created_at < b.created_at ? 1 : -1;
  });

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async () => loadCollection<Transaction>("transactions")
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (payload: Omit<Transaction, "id" | "created_at">) =>
    ({ ...payload, id: uid(), created_at: nowISO() } as Transaction)
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({
    id,
    ...payload
  }: Partial<Omit<Transaction, "created_at">> & { id: string }) =>
    ({ id, ...payload } as Transaction)
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id: string) => id
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
        state.items = sortByDate(action.payload);
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items = sortByDate([action.payload, ...state.items]);
        saveCollection(
          "transactions",
          state.items.map(({ category, account, ...rest }) => rest)
        );
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload };
          state.items = sortByDate(state.items);
          saveCollection(
            "transactions",
            state.items.map(({ category, account, ...rest }) => rest)
          );
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        saveCollection(
          "transactions",
          state.items.map(({ category, account, ...rest }) => rest)
        );
      });
  },
});

export default transactionsSlice.reducer;
