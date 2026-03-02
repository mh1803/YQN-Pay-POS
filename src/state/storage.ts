import { Transaction } from '../types/state';

const STORAGE_KEY = 'yqn-pay-pos-transactions-v2';

export function loadTransactions(): Transaction[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
