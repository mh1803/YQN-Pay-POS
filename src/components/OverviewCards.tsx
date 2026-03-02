import { Transaction } from '../types/state';
import { formatCurrency } from '../utils/currency';

interface OverviewCardsProps {
  transactions: Transaction[];
}

function sumTransactions(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    if (transaction.status === 'success') {
      return total + transaction.amount;
    }

    return total;
  }, 0);
}

export function OverviewCards({ transactions }: OverviewCardsProps) {
  const totalSales = sumTransactions(transactions);
  const successCount = transactions.filter((transaction) => transaction.status === 'success').length;
  const failedCount = transactions.filter(
    (transaction) => transaction.status === 'failed' || transaction.status === 'timed_out' || transaction.status === 'canceled',
  ).length;
  const cardCount = transactions.filter((transaction) => transaction.method === 'card').length;
  const qrCount = transactions.filter((transaction) => transaction.method === 'qr').length;

  return (
    <div className="overview-grid">
      <section className="panel metric-card">
        <p className="eyebrow">Sales Today</p>
        <h2>{formatCurrency(totalSales)}</h2>
        <p className="muted">Running total across successful activity.</p>
      </section>
      <section className="panel metric-card">
        <p className="eyebrow">Successful Payments</p>
        <h2>{successCount}</h2>
        <p className="muted">Fast reassurance during the shift.</p>
      </section>
      <section className="panel metric-card">
        <p className="eyebrow">Failed Attempts</p>
        <h2>{failedCount}</h2>
        <p className="muted">Includes declines, timeouts, and cancellations.</p>
      </section>
      <section className="panel metric-card">
        <p className="eyebrow">Method Split</p>
        <h2>
          {cardCount} / {qrCount}
        </h2>
        <p className="muted">Card vs QR transaction count.</p>
      </section>
    </div>
  );
}
