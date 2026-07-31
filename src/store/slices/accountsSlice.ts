import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Account } from "../../types";
import { loadCollection, saveCollection, uid, nowISO } from "../../lib/localStorage";

interface AccountsState {
  items: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk("accounts/fetchAll", async () => {
  return loadCollection<Account>("accounts");
});

export const createAccount = createAsyncThunk(
  "accounts/create",
  async (payload: Omit<Account, "id" | "created_at">) => {
    const account: Account = {
      ...payload,
      id: uid(),
      created_at: nowISO(),
    };
    return account;
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/update",
  async ({ id, ...payload }: Partial<Account> & { id: string }) => {
    return { id, ...payload } as Account;
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/delete",
  async (id: string) => id
);

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        saveCollection("accounts", state.items);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload };
          saveCollection("accounts", state.items);
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
        saveCollection("accounts", state.items);
      });
  },
});

export default accountsSlice.reducer;
