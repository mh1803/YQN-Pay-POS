import { OverviewCards } from '../components/OverviewCards';
import { Transaction } from '../types/state';
import { formatCurrency } from '../utils/currency';
import { formatTime } from '../utils/dates';
import { formatPaymentMethodLabel, formatServiceLabel, formatTransactionStatus } from '../utils/transactions';

interface OverviewScreenProps {
  transactions: Transaction[];
}

export function OverviewScreen({ transactions }: OverviewScreenProps) {
  const latestTransactions = transactions.slice(0, 4);
  const successfulTransactions = transactions.filter((transaction) => transaction.status === 'success');
  const cashCount = successfulTransactions.filter((transaction) => transaction.method === 'cash').length;
  const cardCount = successfulTransactions.filter((transaction) => transaction.method === 'card').length;
  const qrCount = successfulTransactions.filter((transaction) => transaction.method === 'qr').length;
  const takeoutCount = successfulTransactions.filter((transaction) => (transaction.tableName ?? 'Takeout') === 'Takeout').length;
  const tableCount = successfulTransactions.length - takeoutCount;

  return (
    <div className="overview-layout">
      <section className="panel overview-header-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Analytics</p>
            <h2>Shift Performance</h2>
            <p className="muted">Live totals, mix, and recent activity for the current shift.</p>
          </div>
          <span className="badge">{transactions.length} records</span>
        </div>
      </section>
      <OverviewCards transactions={transactions} />
      <div className="overview-detail-grid">
        <section className="panel overview-breakdown-panel">
          <div className="section-heading">
            <div>
              <h2>Breakdown</h2>
            </div>
          </div>
          <div className="overview-breakdown-list">
            <div className="overview-breakdown-block">
              <div className="overview-breakdown-head">
                <strong>Payment Mix</strong>
              </div>
              <div className="overview-breakdown-row">
                <span>Cash</span>
                <strong>{cashCount}</strong>
              </div>
              <div className="overview-breakdown-row">
                <span>Card</span>
                <strong>{cardCount}</strong>
              </div>
              <div className="overview-breakdown-row">
                <span>QR Pay</span>
                <strong>{qrCount}</strong>
              </div>
            </div>
            <div className="overview-breakdown-block">
              <div className="overview-breakdown-head">
                <strong>Service Mix</strong>
              </div>
              <div className="overview-breakdown-row">
                <span>Takeout</span>
                <strong>{takeoutCount}</strong>
              </div>
              <div className="overview-breakdown-row">
                <span>Table</span>
                <strong>{tableCount}</strong>
              </div>
              <div className="overview-breakdown-row">
                <span>Recovered Revenue</span>
                <strong>{formatCurrency(successfulTransactions.reduce((total, transaction) => total + transaction.amount, 0))}</strong>
              </div>
            </div>
          </div>
        </section>
        <section className="panel overview-activity-panel">
          <div className="section-heading">
            <div>
              <h2>Recent Activity</h2>
            </div>
          </div>
          <div className="overview-activity-list">
            {latestTransactions.length === 0 ? (
              <article className="empty-order">
                <h3>No shift activity yet</h3>
                <p className="muted">Overview cards will update after the first completed payment.</p>
              </article>
            ) : null}
            {latestTransactions.map((transaction) => (
              <article key={transaction.id} className="overview-activity-row">
                <div className="overview-activity-main">
                  <div className="overview-activity-topline">
                    <strong>{formatCurrency(transaction.amount)}</strong>
                    <span className={`status-pill status-pill-${transaction.status}`}>
                      {formatTransactionStatus(transaction.status)}
                    </span>
                  </div>
                  <div className="overview-activity-meta muted">
                    <span>{transaction.id}</span>
                    <span>{formatPaymentMethodLabel(transaction.method)}</span>
                    <span>{formatServiceLabel(transaction)}</span>
                    <span>{formatTime(transaction.timestamp)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
