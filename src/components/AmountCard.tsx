import { formatCurrency } from '../utils/currency';

interface AmountCardProps {
  total: number;
}

export function AmountCard({ total }: AmountCardProps) {
  return (
    <section className="panel amount-card">
      <p className="eyebrow">Amount Due</p>
      <h2>{formatCurrency(total)}</h2>
    </section>
  );
}
