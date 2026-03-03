import { PaymentStatusPanel } from './PaymentStatusPanel';
import { CardIcon, CashIcon, ChevronRightIcon, QrIcon } from './AppIcons';
import { formatCurrency } from '../utils/currency';
import { DemoScenario, PaymentMethod, PaymentStatus } from '../types/state';

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  total: number;
  selectedMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentScenario: DemoScenario;
  onClose: () => void;
  onSelect: (method: 'cash' | 'card' | 'qr') => void;
  onResolve: () => void;
  onNewSale: () => void;
  onScenarioChange: (scenario: DemoScenario) => void;
  onChangeMethod: () => void;
}

const methods = [
  {
    id: 'cash',
    label: 'Cash',
    description: 'Counter payment',
    icon: <CashIcon />,
  },
  {
    id: 'card',
    label: 'Debit Card',
    description: 'Card terminal',
    icon: <CardIcon />,
  },
  {
    id: 'qr',
    label: 'QR Pay',
    description: 'Scan to pay',
    icon: <QrIcon />,
  },
] as const;

export function PaymentMethodSelector({
  isOpen,
  total,
  selectedMethod,
  paymentStatus,
  paymentScenario,
  onClose,
  onSelect,
  onResolve,
  onNewSale,
  onScenarioChange,
  onChangeMethod,
}: PaymentMethodSelectorProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="payment-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="panel payment-method-modal payment-flow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-method-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close-button payment-flow-close" onClick={onClose} aria-label="Close dialog">
          X
        </button>
        {selectedMethod ? (
          <div className="payment-stage payment-stage-review">
            <PaymentStatusPanel
              method={selectedMethod}
              total={total}
              status={paymentStatus}
              scenario={paymentScenario}
              onScenarioChange={onScenarioChange}
              onResolve={onResolve}
              onNewSale={onNewSale}
              onChangeMethod={onChangeMethod}
              embedded
            />
          </div>
        ) : (
          <div className="payment-stage payment-stage-select">
            <div className="section-heading payment-flow-header">
              <div>
                <p className="eyebrow">Payment Method</p>
                <h2 id="payment-method-title">Select payment method</h2>
              </div>
            </div>
            <div className="payment-total-preview">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <div className="method-grid">
              {methods.map((method) => (
                <button key={method.id} type="button" className="method-tile" onClick={() => onSelect(method.id)}>
                  <span className="method-icon" aria-hidden="true">
                    {method.icon}
                  </span>
                  <span className="method-copy">
                    <span className="method-label">{method.label}</span>
                    <span className="muted">{method.description}</span>
                  </span>
                  <span className="method-arrow" aria-hidden="true">
                    <ChevronRightIcon />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
