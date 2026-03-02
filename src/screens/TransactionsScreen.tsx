import { TransactionDetail } from '../components/TransactionDetail';
import { TransactionList } from '../components/TransactionList';
import { Transaction } from '../types/state';

interface TransactionsScreenProps {
  transactions: Transaction[];
  activeTransactionId: string | null;
  onOpenTransaction: (id: string) => void;
  onCloseTransaction: () => void;
  onRefundTransaction: (id: string) => void;
  onVoidTransaction: (id: string) => void;
}

export function TransactionsScreen({
  transactions,
  activeTransactionId,
  onOpenTransaction,
  onCloseTransaction,
  onRefundTransaction,
  onVoidTransaction,
}: TransactionsScreenProps) {
  const activeTransaction = transactions.find((transaction) => transaction.id === activeTransactionId);

  return (
    <div className="transactions-layout">
      <TransactionList
        transactions={transactions}
        activeTransactionId={activeTransactionId}
        onOpen={onOpenTransaction}
      />
      <TransactionDetail
        transaction={activeTransaction}
        onClose={onCloseTransaction}
        onRefund={onRefundTransaction}
        onVoid={onVoidTransaction}
      />
    </div>
  );
}
