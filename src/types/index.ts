export type AccountType = "cash" | "bank" | "credit_card" | "upi" | "wallet";

export type TransactionType = "income" | "expense";

export type CategoryType = "income" | "expense";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  color: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  account_id: string;
  date: string;
  note: string | null;
  created_at: string;
}

export interface Budget {
  id: string;
  category_id: string;
  amount: number;
  month: string;
  created_at: string;
}

export interface TransactionWithDetails extends Transaction {
  category?: Category;
  account?: Account;
}

export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export interface AppSettings {
  currency: Currency;
  monthBudget: number;
}
