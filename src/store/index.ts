import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import accountsReducer from "./slices/accountsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import transactionsReducer from "./slices/transactionsSlice";
import budgetsReducer from "./slices/budgetsSlice";
import settingsReducer from "./slices/settingsSlice";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
