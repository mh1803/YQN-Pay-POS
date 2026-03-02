import { PaymentMethod } from '../types/state';

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: 'cash' | 'card' | 'qr') => void;
}

const methods = [
  {
    id: 'cash',
    label: 'Cash',
    description: 'Confirm cash received at the counter.',
  },
  {
    id: 'card',
    label: 'Debit Card',
    description: 'Tap, insert, or swipe on the reader.',
  },
  {
    id: 'qr',
    label: 'QR Pay',
    description: 'Display code for customer scan and confirm.',
  },
] as const;

export function PaymentMethodSelector({ isOpen, onClose, onSelect }: PaymentMethodSelectorProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="payment-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="panel payment-method-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-method-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Payment Method</p>
            <h2 id="payment-method-title">Choose how to complete the order</h2>
          </div>
          <button type="button" className="secondary-button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="method-grid">
          {methods.map((method) => (
            <button key={method.id} type="button" className="method-tile active" onClick={() => onSelect(method.id)}>
              <span className="method-label">{method.label}</span>
              <span className="muted">{method.description}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
