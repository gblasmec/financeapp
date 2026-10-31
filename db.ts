import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entry, MonthlySummary, DailySummary } from '../types';
import { getDaysInMonth, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ENTRIES_KEY = 'finance_entries_v1';

export async function getAllEntries(): Promise<Entry[]> {
  try {
    const raw = await AsyncStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveEntry(entry: Entry): Promise<void> {
  const entries = await getAllEntries();
  entries.push(entry);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getAllEntries();
  const filtered = entries.filter((e) => e.id !== id);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
}

export async function getEntriesByMonth(
  year: number,
  month: number
): Promise<Entry[]> {
  const entries = await getAllEntries();
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return entries
    .filter((e) => e.date.startsWith(prefix))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function buildMonthlySummary(
  entries: Entry[],
  year: number,
  month: number
): MonthlySummary {
  const daysCount = getDaysInMonth(new Date(year, month - 1));
  const dayMap: Record<string, DailySummary> = {};

  for (let d = 1; d <= daysCount; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    dayMap[dateStr] = {
      date: dateStr,
      label: String(d).padStart(2, '0'),
      income: 0,
      expense: 0,
      balance: 0,
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;

  for (const entry of entries) {
    if (dayMap[entry.date]) {
      if (entry.type === 'income') {
        dayMap[entry.date].income += entry.amount;
        totalIncome += entry.amount;
      } else {
        dayMap[entry.date].expense += entry.amount;
        totalExpense += entry.amount;
      }
    }
  }

  const days = Object.values(dayMap).map((d) => ({
    ...d,
    balance: d.income - d.expense,
  }));

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    days,
  };
}
