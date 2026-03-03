import { PaymentMethod, Transaction, TransactionStatus } from '../types/state';
import { formatCurrency } from './currency';

export function formatTransactionStatus(status: TransactionStatus): string {
  switch (status) {
    case 'timed_out':
      return 'Timed Out';
    case 'refunded':
      return 'Refunded';
    case 'voided':
      return 'Voided';
    case 'failed':
      return 'Failed';
    case 'canceled':
      return 'Canceled';
    case 'success':
      return 'Success';
    default:
      return status;
  }
}

export function formatPaymentMethodLabel(method: Exclude<PaymentMethod, null>): string {
  switch (method) {
    case 'cash':
      return 'Cash';
    case 'card':
      return 'Debit Card';
    case 'qr':
      return 'QR Pay';
  }
}

export function formatServiceLabel(transaction: Transaction): string {
  return transaction.tableName ?? 'Takeout';
}

export function formatOrderSummary(transaction: Transaction): string {
  if (!transaction.orderItems || transaction.orderItems.length === 0) {
    return 'No items recorded';
  }

  return transaction.orderItems.map((item) => `${item.quantity}x ${item.name}`).join(', ');
}

export function formatOrderItemTotal(price: number, quantity: number): string {
  return formatCurrency(price * quantity);
}
