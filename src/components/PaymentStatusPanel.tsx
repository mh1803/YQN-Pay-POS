import type { ReactNode } from 'react';
import { AlertIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from './AppIcons';
import { formatCurrency } from '../utils/currency';
import { DemoScenario, PaymentMethod, PaymentStatus } from '../types/state';

interface PaymentStatusPanelProps {
  method: PaymentMethod;
  total: number;
  status: PaymentStatus;
  scenario: DemoScenario;
  onScenarioChange: (scenario: DemoScenario) => void;
  onResolve: () => void;
  onNewSale: () => void;
  onChangeMethod: () => void;
  embedded?: boolean;
}

const scenarioOptions: DemoScenario[] = ['success', 'declined', 'timeout', 'canceled'];

const scenarioConfig: Record<
  DemoScenario,
  { label: string; caption: string; icon: ReactNode; className: string }
> = {
  success: { label: 'Success', caption: 'Approve payment', icon: <CheckCircleIcon />, className: 'response-card-success' },
  declined: { label: 'Failed', caption: 'Decline payment', icon: <AlertIcon />, className: 'response-card-failed' },
  timeout: { label: 'Timed Out', caption: 'No completion', icon: <ClockIcon />, className: 'response-card-timeout' },
  canceled: { label: 'Canceled', caption: 'Stop payment', icon: <XCircleIcon />, className: 'response-card-canceled' },
};

const outcomeConfig: Record<
  Exclude<PaymentStatus, 'idle' | 'processing' | 'collecting'>,
  { title: string; caption: string; icon: ReactNode; className: string }
> = {
  success: {
    title: 'Payment Successful',
    caption: 'Saved to transactions.',
    icon: <CheckCircleIcon />,
    className: 'payment-outcome-success',
  },
  failed: {
    title: 'Payment Failed',
    caption: 'Select another payment type to continue.',
    icon: <AlertIcon />,
    className: 'payment-outcome-failed',
  },
  canceled: {
    title: 'Payment Canceled',
    caption: 'You can go back and choose another method.',
    icon: <XCircleIcon />,
    className: 'payment-outcome-canceled',
  },
  timed_out: {
    title: 'Payment Timed Out',
    caption: 'Choose another payment type to retry.',
    icon: <ClockIcon />,
    className: 'payment-outcome-timeout',
  },
};

function formatStatusLabel(status: PaymentStatus): string {
  if (status === 'timed_out') {
    return 'Timed Out';
  }

  if (status === 'idle') {
    return 'Ready for Payment';
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getPrimaryLabel(method: PaymentMethod, status: PaymentStatus): string {
  if (status === 'idle') {
    return 'Apply Response';
  }
  if (status === 'success') {
    return 'New Sale';
  }
  if (status === 'failed' || status === 'timed_out' || status === 'canceled') {
    return 'Choose Payment Type';
  }
  return 'Payment In Progress';
}

export function PaymentStatusPanel({
  method,
  total,
  status,
  scenario,
  onScenarioChange,
  onResolve,
  onNewSale,
  onChangeMethod,
  embedded = false,
}: PaymentStatusPanelProps) {
  const isReady = status === 'idle';
  const isRecoveryState = status === 'failed' || status === 'timed_out' || status === 'canceled';
  const isOutcomeState = status === 'success' || isRecoveryState;
  const methodLabel =
    method === 'cash' ? 'Cash' : method === 'qr' ? 'QR Pay' : method === 'card' ? 'Debit Card' : 'Awaiting method';
  const outcome = isOutcomeState ? outcomeConfig[status] : null;

  return (
    <section className={`${embedded ? 'payment-panel payment-panel-embedded' : 'panel payment-panel'} status-${status}`}>
      <div className="section-heading payment-panel-heading">
        <div>
          <h2>
            {formatStatusLabel(status)} <span className="payment-method-inline">({methodLabel})</span>
          </h2>
        </div>
      </div>

      <div className="payment-total-strip">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      {isReady ? (
        <div className="response-grid">
          {scenarioOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={
                scenario === option
                  ? `response-card ${scenarioConfig[option].className} active`
                  : `response-card ${scenarioConfig[option].className}`
              }
              onClick={() => onScenarioChange(option)}
            >
              <span className="response-icon" aria-hidden="true">
                {scenarioConfig[option].icon}
              </span>
              <span className="response-copy">
                <strong>{scenarioConfig[option].label}</strong>
                <span>{scenarioConfig[option].caption}</span>
              </span>
            </button>
          ))}
        </div>
      ) : outcome ? (
        <div className={`payment-outcome ${outcome.className}`}>
          <span className="payment-outcome-icon" aria-hidden="true">
            {outcome.icon}
          </span>
          <strong>{outcome.title}</strong>
          <p className="muted">{outcome.caption}</p>
        </div>
      ) : null}

      <div className="payment-actions">
        {status === 'success' ? (
          <button type="button" className="primary-button" onClick={onNewSale}>
            {getPrimaryLabel(method, status)}
          </button>
        ) : isReady ? (
          <button type="button" className="primary-button" onClick={onResolve}>
            {getPrimaryLabel(method, status)}
          </button>
        ) : isRecoveryState ? (
          <button type="button" className="primary-button" onClick={onChangeMethod}>
            {getPrimaryLabel(method, status)}
          </button>
        ) : (
          <button type="button" className="primary-button" disabled>
            {getPrimaryLabel(method, status)}
          </button>
        )}

        {isReady || isRecoveryState ? (
          <button type="button" className="secondary-button" onClick={onChangeMethod}>
            Back to Methods
          </button>
        ) : null}
      </div>
    </section>
  );
}
