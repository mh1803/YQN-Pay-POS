import { DemoScenario, PaymentMethod, PaymentStatus } from '../types/state';

interface PaymentStatusPanelProps {
  method: PaymentMethod;
  status: PaymentStatus;
  message: string;
  scenario: DemoScenario;
  onScenarioChange: (scenario: DemoScenario) => void;
  onResolve: () => void;
  onNewSale: () => void;
  onRetry: () => void;
}

const scenarioOptions: DemoScenario[] = ['success', 'declined', 'timeout', 'canceled'];

function getPrimaryLabel(method: PaymentMethod, status: PaymentStatus): string {
  if (status === 'success') {
    return 'New Sale';
  }
  if (status === 'failed' || status === 'timed_out' || status === 'canceled') {
    return 'Choose Another Method';
  }
  return 'Payment In Progress';
}

export function PaymentStatusPanel({
  method,
  status,
  message,
  scenario,
  onScenarioChange,
  onResolve,
  onNewSale,
  onRetry,
}: PaymentStatusPanelProps) {
  const isBusy = status === 'processing' || status === 'collecting';
  const isRecoveryState = status === 'failed' || status === 'timed_out' || status === 'canceled';
  const methodLabel =
    method === 'cash' ? 'Cash' : method === 'qr' ? 'QR Pay' : method === 'card' ? 'Debit Card' : 'Awaiting method';

  return (
    <section className={`panel payment-panel status-${status}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Payment Status</p>
          <h2>{status === 'idle' ? 'Ready to charge' : status.replace('_', ' ')}</h2>
        </div>
        <span className="badge">{methodLabel}</span>
      </div>

      <div className="status-strip">
        <strong>{methodLabel}</strong>
        <p>{message}</p>
      </div>

      {method === 'qr' && isBusy ? (
        <div className="qr-box" aria-label="Mock QR code">
          <div />
          <div />
          <div />
          <div />
          <p>Customer scans to pay</p>
        </div>
      ) : null}

      <div className="scenario-row">
        {scenarioOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={scenario === option ? 'scenario-chip active' : 'scenario-chip'}
            onClick={() => onScenarioChange(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="action-group">
        {status === 'success' ? (
          <button type="button" className="primary-button" onClick={onNewSale}>
            {getPrimaryLabel(method, status)}
          </button>
        ) : isRecoveryState ? (
          <button type="button" className="primary-button" onClick={onRetry}>
            {getPrimaryLabel(method, status)}
          </button>
        ) : (
          <button type="button" className="primary-button" disabled>
            {getPrimaryLabel(method, status)}
          </button>
        )}

        {isBusy ? (
          <button type="button" className="secondary-button" onClick={onResolve}>
            Force Outcome
          </button>
        ) : null}

        {isRecoveryState ? (
          <button type="button" className="secondary-button" onClick={onRetry}>
            Retry Payment
          </button>
        ) : null}
      </div>
    </section>
  );
}
