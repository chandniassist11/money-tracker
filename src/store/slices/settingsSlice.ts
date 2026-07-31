import { createSlice } from "@reduxjs/toolkit";
import type { AppSettings } from "../../types";

const CURRENCY_STORAGE_KEY = "mt_settings";

const defaultSettings: AppSettings = {
  currency: { code: "INR", symbol: "₹", label: "Indian Rupee" },
  monthBudget: 50000,
};

const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultSettings;
};

interface SettingsState extends AppSettings {}

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCurrency(state, action) {
      state.currency = action.payload;
      localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(state));
    },
    setMonthBudget(state, action) {
      state.monthBudget = action.payload;
      localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(state));
    },
  },
});

export const { setCurrency, setMonthBudget } = settingsSlice.actions;
export default settingsSlice.reducer;
