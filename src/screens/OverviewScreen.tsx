import { OverviewCards } from '../components/OverviewCards';
import { Transaction } from '../types/state';

interface OverviewScreenProps {
  transactions: Transaction[];
}

export function OverviewScreen({ transactions }: OverviewScreenProps) {
  const latestTransactions = transactions.slice(0, 4);

  return (
    <div className="overview-layout">
      <OverviewCards transactions={transactions} />
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Today at a Glance</p>
            <h2>Shift summary</h2>
          </div>
        </div>
        <div className="insight-grid">
          {latestTransactions.length === 0 ? (
            <article className="empty-order">
              <h3>No shift activity yet</h3>
              <p className="muted">Overview cards will update after the first completed payment.</p>
            </article>
          ) : null}
          {latestTransactions.map((transaction) => (
            <article key={transaction.id} className="insight-card">
              <strong>{transaction.id}</strong>
              <p>
                {transaction.method === 'card' ? 'Debit card' : 'QR pay'} payment recorded with status{' '}
                <span className={`status-text-${transaction.status}`}>{transaction.status}</span>.
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
