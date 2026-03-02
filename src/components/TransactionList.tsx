import { Transaction } from '../types/state';
import { formatCurrency } from '../utils/currency';
import { formatTime } from '../utils/dates';

interface TransactionListProps {
  transactions: Transaction[];
  activeTransactionId: string | null;
  onOpen: (transactionId: string) => void;
}

export function TransactionList({ transactions, activeTransactionId, onOpen }: TransactionListProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Recent Transactions</p>
          <h2>Activity feed</h2>
        </div>
        <span className="badge">{transactions.length} records</span>
      </div>

      <div className="transaction-list">
        {transactions.length === 0 ? (
          <article className="empty-order">
            <h3>No transactions yet</h3>
            <p className="muted">Completed payments will appear here once a sale is taken.</p>
          </article>
        ) : null}
        {transactions.map((transaction) => (
          <button
            key={transaction.id}
            type="button"
            className={transaction.id === activeTransactionId ? 'transaction-row active' : 'transaction-row'}
            onClick={() => onOpen(transaction.id)}
          >
            <div>
              <strong>{formatCurrency(transaction.amount)}</strong>
              <p className="muted">
                {transaction.method === 'cash'
                  ? 'Cash'
                  : transaction.method === 'card'
                    ? 'Debit card'
                    : 'QR pay'}{' '}
                • {formatTime(transaction.timestamp)}
              </p>
            </div>
            <div className={`status-pill status-pill-${transaction.status}`}>{transaction.status}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
