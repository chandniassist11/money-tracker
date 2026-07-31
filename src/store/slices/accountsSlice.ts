import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Account } from "../../types";
import { supabase } from "../../lib/supabaseClient";

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

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAll",
  async () => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Account[];
  }
);

export const createAccount = createAsyncThunk(
  "accounts/create",
  async (payload: Omit<Account, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("accounts")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Account;
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/update",
  async ({ id, ...payload }: Partial<Account> & { id: string }) => {
    const { data, error } = await supabase
      .from("accounts")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Account;
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/delete",
  async (id: string) => {
    const { error } = await supabase.from("accounts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return id;
  }
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
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load accounts";
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      });
  },
});

export default accountsSlice.reducer;
