import { useMemo, useState } from 'react';
import { TransactionDetail } from '../components/TransactionDetail';
import { TransactionList } from '../components/TransactionList';
import { Transaction } from '../types/state';
import { formatOrderSummary, formatPaymentMethodLabel, formatServiceLabel, formatTransactionStatus } from '../utils/transactions';

interface TransactionsScreenProps {
  transactions: Transaction[];
  activeTransactionId: string | null;
  onOpenTransaction: (id: string) => void;
  onPrintTransaction: (transaction: Transaction) => void;
  onRefundTransaction: (id: string) => void;
  onVoidTransaction: (id: string) => void;
}

export function TransactionsScreen({
  transactions,
  activeTransactionId,
  onOpenTransaction,
  onPrintTransaction,
  onRefundTransaction,
  onVoidTransaction,
}: TransactionsScreenProps) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Transaction['status']>('all');
  const [sortValue, setSortValue] = useState<'newest' | 'oldest' | 'amount_desc' | 'amount_asc'>('newest');

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    const results = transactions.filter((transaction) => {
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        transaction.id,
        transaction.cashier,
        transaction.customerLabel,
        transaction.tableName ?? 'Takeout',
        formatPaymentMethodLabel(transaction.method),
        formatTransactionStatus(transaction.status),
        formatServiceLabel(transaction),
        formatOrderSummary(transaction),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    return results.sort((left, right) => {
      if (sortValue === 'oldest') {
        return new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime();
      }

      if (sortValue === 'amount_desc') {
        return right.amount - left.amount;
      }

      if (sortValue === 'amount_asc') {
        return left.amount - right.amount;
      }

      return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();
    });
  }, [transactions, searchValue, statusFilter, sortValue]);

  const activeTransaction =
    filteredTransactions.find((transaction) => transaction.id === activeTransactionId) ?? filteredTransactions[0];
  const resolvedActiveTransactionId = activeTransaction?.id ?? null;

  return (
    <div className="transactions-layout">
      <TransactionList
        transactions={filteredTransactions}
        totalTransactions={transactions.length}
        activeTransactionId={resolvedActiveTransactionId}
        searchValue={searchValue}
        statusFilter={statusFilter}
        sortValue={sortValue}
        onOpen={onOpenTransaction}
        onSearchChange={setSearchValue}
        onStatusFilterChange={setStatusFilter}
        onSortChange={setSortValue}
      />
      <TransactionDetail
        transaction={activeTransaction}
        onPrint={onPrintTransaction}
        onRefund={onRefundTransaction}
        onVoid={onVoidTransaction}
      />
    </div>
  );
}
