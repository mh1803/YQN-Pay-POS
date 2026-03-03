import { PaymentIcon, PlateIcon, PoundIcon, ReceiptIcon } from './AppIcons';
import { Transaction } from '../types/state';
import { formatCurrency } from '../utils/currency';
import { formatPaymentMethodLabel } from '../utils/transactions';

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

function getTopItemLabel(transactions: Transaction[]): string {
  const counts = new Map<string, number>();

  transactions.forEach((transaction) => {
    transaction.orderItems?.forEach((item) => {
      counts.set(item.name, (counts.get(item.name) ?? 0) + item.quantity);
    });
  });

  const topEntry = [...counts.entries()].sort((left, right) => right[1] - left[1])[0];
  return topEntry ? `${topEntry[0]} (${topEntry[1]})` : 'No item data';
}

function getMostUsedMethodLabel(transactions: Transaction[]): string {
  const counts = new Map<string, number>();

  transactions.forEach((transaction) => {
    counts.set(transaction.method, (counts.get(transaction.method) ?? 0) + 1);
  });

  const topEntry = [...counts.entries()].sort((left, right) => right[1] - left[1])[0];

  if (!topEntry) {
    return 'No sales yet';
  }

  return `${formatPaymentMethodLabel(topEntry[0] as Transaction['method'])} (${topEntry[1]})`;
}

function renderLabelWithBracketValue(value: string) {
  const match = value.match(/^(.*?)(\s*\([^)]*\))$/);

  if (!match) {
    return value;
  }

  return (
    <>
      {match[1]}
      <span className="inline-bracket-value">{match[2]}</span>
    </>
  );
}

export function OverviewCards({ transactions }: OverviewCardsProps) {
  const totalSales = sumTransactions(transactions);
  const successCount = transactions.filter((transaction) => transaction.status === 'success').length;
  const failedCount = transactions.filter(
    (transaction) => transaction.status === 'failed' || transaction.status === 'timed_out' || transaction.status === 'canceled',
  ).length;
  const successfulTransactions = transactions.filter((transaction) => transaction.status === 'success');
  const averageTicket = successCount > 0 ? totalSales / successCount : 0;
  const mostUsedMethod = getMostUsedMethodLabel(successfulTransactions);
  const topItem = getTopItemLabel(successfulTransactions);

  return (
    <div className="overview-grid overview-analytics-grid">
      <section className="panel overview-hero-card">
        <div className="overview-card-icon" aria-hidden="true">
          <PoundIcon />
        </div>
        <p className="eyebrow">Net Sales</p>
        <h2>{formatCurrency(totalSales)}</h2>
        <div className="overview-hero-meta">
          <div>
            <span>Completed</span>
            <strong>{successCount}</strong>
          </div>
          <div>
            <span>Exceptions</span>
            <strong>{failedCount}</strong>
          </div>
        </div>
      </section>
      <section className="panel metric-card">
        <div className="overview-card-icon" aria-hidden="true">
          <ReceiptIcon />
        </div>
        <p className="eyebrow">Average Ticket</p>
        <h2>{formatCurrency(averageTicket)}</h2>
        <p className="muted">Per completed sale.</p>
      </section>
      <section className="panel metric-card">
        <div className="overview-card-icon" aria-hidden="true">
          <PlateIcon />
        </div>
        <p className="eyebrow">Top Item</p>
        <h2>{renderLabelWithBracketValue(topItem)}</h2>
        <p className="muted">Best-selling item by quantity.</p>
      </section>
      <section className="panel metric-card metric-card-accent">
        <div className="overview-card-icon" aria-hidden="true">
          <PaymentIcon />
        </div>
        <p className="eyebrow">Most Used Payment</p>
        <h2>{renderLabelWithBracketValue(mostUsedMethod)}</h2>
        <p className="muted">Most frequent successful payment type.</p>
      </section>
    </div>
  );
}
