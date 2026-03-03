import { useState } from 'react';
import { Transaction } from '../types/state';
import { formatCurrency } from '../utils/currency';
import { formatDateTime } from '../utils/dates';
import {
  formatOrderItemTotal,
  formatPaymentMethodLabel,
  formatServiceLabel,
  formatTransactionStatus,
} from '../utils/transactions';

interface TransactionDetailProps {
  transaction: Transaction | undefined;
  onPrint: (transaction: Transaction) => void;
  onRefund: (id: string) => void;
  onVoid: (id: string) => void;
}

type PendingAction = 'print' | 'refund' | 'void' | null;

export function TransactionDetail({ transaction, onPrint, onRefund, onVoid }: TransactionDetailProps) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  if (!transaction) {
    return (
      <section className="panel detail-panel transaction-detail-panel empty-state">
        <h2>No transactions yet</h2>
        <p className="muted">Completed payments will appear here once a sale is taken.</p>
      </section>
    );
  }

  const canAdjust = transaction.status === 'success';
  const confirmConfig =
    pendingAction === 'print'
      ? {
          eyebrow: 'Print Receipt',
          title: `Print receipt for ${transaction.id}?`,
          confirmLabel: 'Print Receipt',
          onConfirm: () => onPrint(transaction),
          destructive: false,
        }
      : pendingAction === 'refund'
        ? {
            eyebrow: 'Refund Transaction',
            title: `Refund ${transaction.id}?`,
            confirmLabel: 'Confirm Refund',
            onConfirm: () => onRefund(transaction.id),
            destructive: true,
          }
        : pendingAction === 'void'
          ? {
              eyebrow: 'Void Transaction',
              title: `Void ${transaction.id}?`,
              confirmLabel: 'Confirm Void',
              onConfirm: () => onVoid(transaction.id),
              destructive: true,
            }
          : null;

  return (
    <>
      <section className="panel detail-panel transaction-detail-panel">
        <div className="section-heading transaction-detail-header">
          <div>
            <h2>{transaction.id}</h2>
            <p className="muted">{formatDateTime(transaction.timestamp)}</p>
          </div>
        </div>

        <div className="transaction-detail-summary">
          <div className="transaction-detail-total">
            <span className="detail-label">Total</span>
            <strong>{formatCurrency(transaction.amount)}</strong>
          </div>
          <div className="transaction-detail-summary-meta">
            <span className={`status-pill status-pill-${transaction.status}`}>{formatTransactionStatus(transaction.status)}</span>
            <span className="badge">{formatPaymentMethodLabel(transaction.method)}</span>
          </div>
        </div>

        <div className="transaction-detail-body">
          <div className="detail-grid transaction-meta-grid">
            <div>
              <span className="detail-label">Status</span>
              <strong className={`status-text-${transaction.status}`}>{formatTransactionStatus(transaction.status)}</strong>
            </div>
            <div>
              <span className="detail-label">Service</span>
              <strong>{formatServiceLabel(transaction)}</strong>
            </div>
            <div>
              <span className="detail-label">Cashier</span>
              <strong>{transaction.cashier}</strong>
            </div>
            <div>
              <span className="detail-label">Customer</span>
              <strong>{transaction.customerLabel}</strong>
            </div>
          </div>

          {transaction.orderItems && transaction.orderItems.length > 0 ? (
            <div className="transaction-order-block">
              <div className="section-heading compact-section-heading">
                <div>
                  <h3>Order</h3>
                </div>
              </div>
              <div className="transaction-order-list">
                {transaction.orderItems.map((item) => (
                  <div key={`${item.name}-${item.price}`} className="transaction-order-row">
                    <div>
                      <strong>{item.name}</strong>
                      <p className="muted">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <strong>{formatOrderItemTotal(item.price, item.quantity)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {transaction.failureReason ? <p className="error-callout">{transaction.failureReason}</p> : null}
        </div>

        <div className="transaction-detail-actions">
          <button type="button" className="secondary-button transaction-action-button" onClick={() => setPendingAction('print')}>
            Print Receipt
          </button>
          <button
            type="button"
            className="primary-button transaction-action-button"
            onClick={() => setPendingAction('refund')}
            disabled={!canAdjust}
          >
            Refund
          </button>
          <button
            type="button"
            className="secondary-button transaction-action-button"
            onClick={() => setPendingAction('void')}
            disabled={!canAdjust}
          >
            Void
          </button>
        </div>
      </section>

      {confirmConfig ? (
        <div className="item-remove-backdrop" role="presentation" onClick={() => setPendingAction(null)}>
          <section
            className="panel item-remove-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">{confirmConfig.eyebrow}</p>
                <h2 id="transaction-confirm-title">{confirmConfig.title}</h2>
              </div>
            </div>
            <div className="action-group">
              <button
                type="button"
                className={confirmConfig.destructive ? 'secondary-button destructive-button' : 'primary-button'}
                onClick={() => {
                  confirmConfig.onConfirm();
                  setPendingAction(null);
                }}
              >
                {confirmConfig.confirmLabel}
              </button>
              <button type="button" className="secondary-button" onClick={() => setPendingAction(null)}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
