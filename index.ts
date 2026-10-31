export type EntryType = 'income' | 'expense';

export interface Entry {
  id: string;
  type: EntryType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface DailySummary {
  date: string;
  label: string; // "01", "02", etc
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  days: DailySummary[];
}

export interface CategoryTotal {
  category: string;
  amount: number;
  color: string;
}
