import { FormEvent } from 'react';

interface CashierAccessPanelProps {
  terminalName: string;
  pinValue: string;
  pinError: string;
  onPinChange: (value: string) => void;
  onSubmit: () => void;
}

export function CashierAccessPanel({
  terminalName,
  pinValue,
  pinError,
  onPinChange,
  onSubmit,
}: CashierAccessPanelProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="login-modal-backdrop" role="presentation">
      <section className="panel login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div className="login-modal-header">
          <p className="eyebrow">Terminal</p>
          <h2 id="login-title">{terminalName}</h2>
          <p className="muted">Enter cashier PIN to unlock this terminal.</p>
        </div>

        <form className="pin-form" onSubmit={handleSubmit}>
          <label className="pin-label" htmlFor="cashier-pin">
            Cashier PIN
          </label>
          <div className="pin-row">
            <input
              id="cashier-pin"
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={pinValue}
              onChange={(event) => onPinChange(event.target.value)}
              autoFocus
            />
            <button type="submit" className="primary-button">
              Sign In
            </button>
          </div>
          <p className="muted pin-hint">PINs: 0000 = Mahdi, 1111 = Adema</p>
          {pinError ? <p className="error-callout inline-error">{pinError}</p> : null}
        </form>
      </section>
    </div>
  );
}
