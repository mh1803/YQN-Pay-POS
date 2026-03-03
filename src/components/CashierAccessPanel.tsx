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
  const appendDigit = (digit: string) => {
    onPinChange(`${pinValue}${digit}`.slice(0, 4));
  };

  const removeDigit = () => {
    onPinChange(pinValue.slice(0, -1));
  };

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
          <div className="pin-keypad" aria-label="PIN keypad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                className="pin-key"
                onClick={() => appendDigit(digit)}
                aria-label={`Enter ${digit}`}
              >
                {digit}
              </button>
            ))}
            <button type="button" className="pin-key pin-key-action" onClick={() => onPinChange('')}>
              Clear
            </button>
            <button type="button" className="pin-key" onClick={() => appendDigit('0')} aria-label="Enter 0">
              0
            </button>
            <button type="button" className="pin-key pin-key-action" onClick={removeDigit}>
              Delete
            </button>
          </div>
          <button type="submit" className="primary-button pin-submit">
            Sign In
          </button>
          <p className="muted pin-hint">PINs: 0000 = Mahdi, 1111 = Adema</p>
          {pinError ? <p className="error-callout inline-error">{pinError}</p> : null}
        </form>
      </section>
    </div>
  );
}
