import { Transaction } from '../types/state';
import { formatCurrency } from '../utils/currency';
import { formatDateTime } from '../utils/dates';

interface TransactionDetailProps {
  transaction: Transaction | undefined;
  onClose: () => void;
  onRefund: (id: string) => void;
  onVoid: (id: string) => void;
}

export function TransactionDetail({ transaction, onClose, onRefund, onVoid }: TransactionDetailProps) {
  if (!transaction) {
    return (
      <section className="panel detail-panel empty-state">
        <p className="eyebrow">Transaction Detail</p>
        <h2>Select a transaction</h2>
        <p className="muted">Open any record to view its payment details and prototype follow-up actions.</p>
      </section>
    );
  }

  const canAdjust = transaction.status === 'success';

  return (
    <section className="panel detail-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Transaction Detail</p>
          <h2>{transaction.id}</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="detail-grid">
        <div>
          <span className="detail-label">Amount</span>
          <strong>{formatCurrency(transaction.amount)}</strong>
        </div>
        <div>
          <span className="detail-label">Method</span>
          <strong>
            {transaction.method === 'cash' ? 'Cash' : transaction.method === 'card' ? 'Debit Card' : 'QR Pay'}
          </strong>
        </div>
        <div>
          <span className="detail-label">Status</span>
          <strong className={`status-text-${transaction.status}`}>{transaction.status}</strong>
        </div>
        <div>
          <span className="detail-label">Time</span>
          <strong>{formatDateTime(transaction.timestamp)}</strong>
        </div>
        <div>
          <span className="detail-label">Cashier</span>
          <strong>{transaction.cashier}</strong>
        </div>
        <div>
          <span className="detail-label">Customer</span>
          <strong>{transaction.customerLabel}</strong>
        </div>
        <div>
          <span className="detail-label">Table</span>
          <strong>{transaction.tableName ?? 'Counter'}</strong>
        </div>
      </div>

      {transaction.failureReason ? <p className="error-callout">{transaction.failureReason}</p> : null}

      <div className="action-group">
        <button type="button" className="primary-button" onClick={() => onRefund(transaction.id)} disabled={!canAdjust}>
          Refund
        </button>
        <button type="button" className="secondary-button" onClick={() => onVoid(transaction.id)} disabled={!canAdjust}>
          Void
        </button>
      </div>
    </section>
  );
}
