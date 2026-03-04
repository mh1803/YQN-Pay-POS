import { Transaction } from '../types/state';
import { FilterIcon, SearchIcon, SortIcon } from './AppIcons';
import { formatCurrency } from '../utils/currency';
import { formatTime } from '../utils/dates';
import { formatOrderSummary, formatPaymentMethodLabel, formatServiceLabel, formatTransactionStatus } from '../utils/transactions';

interface TransactionListProps {
  transactions: Transaction[];
  totalTransactions: number;
  activeTransactionId: string | null;
  searchValue: string;
  statusFilter: 'all' | Transaction['status'];
  sortValue: 'newest' | 'oldest' | 'amount_desc' | 'amount_asc';
  onOpen: (transactionId: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: 'all' | Transaction['status']) => void;
  onSortChange: (value: 'newest' | 'oldest' | 'amount_desc' | 'amount_asc') => void;
}

export function TransactionList({
  transactions,
  totalTransactions,
  activeTransactionId,
  searchValue,
  statusFilter,
  sortValue,
  onOpen,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
}: TransactionListProps) {
  return (
    <section className="panel transactions-panel">
      <div className="section-heading">
        <div>
          <h2>Transactions</h2>
        </div>
        <span className="badge">
          {transactions.length}
          {transactions.length !== totalTransactions ? ` / ${totalTransactions}` : ''}{' '}
          {transactions.length === 1 && transactions.length === totalTransactions ? 'record' : 'records'}
        </span>
      </div>

      <div className="transactions-toolbar">
        <label className="transactions-control transactions-control-search">
          <span className="transactions-control-icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            className="transactions-search"
            type="search"
            placeholder="Search transactions"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <label className="transactions-control">
          <span className="transactions-control-icon" aria-hidden="true">
            <FilterIcon />
          </span>
          <select
            className="transactions-filter"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as 'all' | Transaction['status'])}
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="canceled">Canceled</option>
            <option value="timed_out">Timed Out</option>
            <option value="refunded">Refunded</option>
            <option value="voided">Voided</option>
          </select>
        </label>
        <label className="transactions-control transactions-sort">
          <span className="transactions-control-icon" aria-hidden="true">
            <SortIcon />
          </span>
          <select
            className="transactions-filter"
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value as 'newest' | 'oldest' | 'amount_desc' | 'amount_asc')}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount_desc">Amount: High to Low</option>
            <option value="amount_asc">Amount: Low to High</option>
          </select>
        </label>
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
            <div className="transaction-row-main">
              <div className="transaction-row-topline">
                <strong>{formatCurrency(transaction.amount)}</strong>
                <span className={`status-pill status-pill-${transaction.status}`}>
                  {formatTransactionStatus(transaction.status)}
                </span>
              </div>
              <div className="transaction-row-meta muted">
                <span>{transaction.id}</span>
                <span>{formatPaymentMethodLabel(transaction.method)}</span>
                <span>{formatServiceLabel(transaction)}</span>
                <span>{formatTime(transaction.timestamp)}</span>
              </div>
              <p className="transaction-row-order muted">{formatOrderSummary(transaction)}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
