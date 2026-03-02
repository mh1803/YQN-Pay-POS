import { AppView } from '../types/state';

interface HeaderProps {
  activeView: AppView;
  cashierName: string | null;
  terminalName: string;
  onChangeView: (view: AppView) => void;
  onSignOut: () => void;
}

const tabs: Array<{ id: AppView; label: string }> = [
  { id: 'checkout', label: 'Checkout' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'overview', label: 'Overview' },
];

export function Header({ activeView, cashierName, terminalName, onChangeView, onSignOut }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Merchant Console</p>
        <h1>YQN Pay POS</h1>
      </div>
      <nav className="tab-nav" aria-label="Main navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeView ? 'tab-button active' : 'tab-button'}
            onClick={() => onChangeView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="header-session">
        <div className="header-session-card">
          <span>{terminalName}</span>
          <strong>{cashierName ?? 'Locked'}</strong>
        </div>
        {cashierName ? (
          <button type="button" className="secondary-button signout-button" onClick={onSignOut}>
            Sign Out
          </button>
        ) : null}
      </div>
    </header>
  );
}
