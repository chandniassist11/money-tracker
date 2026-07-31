import { useEffect } from "react";
import { useAppDispatch } from "./index";
import { fetchAccounts } from "./slices/accountsSlice";
import { fetchCategories } from "./slices/categoriesSlice";
import { fetchTransactions } from "./slices/transactionsSlice";
import { fetchBudgets } from "./slices/budgetsSlice";

let loaded = false;

export const useLoadAppData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loaded) return;
    loaded = true;
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
  }, [dispatch]);
};
