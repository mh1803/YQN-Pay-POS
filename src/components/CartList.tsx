import { useState } from 'react';
import { CartItem } from '../types/state';
import { formatCurrency } from '../utils/currency';
import { DEMO_VAT, calculateCartSubtotal } from '../utils/pricing';

interface CartListProps {
  selectedTableName: string;
  cart: CartItem[];
  total: number;
  canCompleteOrder: boolean;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onCompleteOrder: () => void;
}

export function CartList({
  selectedTableName,
  cart,
  total,
  canCompleteOrder,
  onIncrement,
  onDecrement,
  onRemove,
  onCompleteOrder,
}: CartListProps) {
  const [pendingRemoval, setPendingRemoval] = useState<CartItem | null>(null);
  const subtotal = calculateCartSubtotal(cart);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Current Basket</p>
          <h2>Quick order</h2>
        </div>
        <span className="badge">{selectedTableName}</span>
      </div>

      <div className="cart-list">
        {cart.length === 0 ? (
          <article className="empty-order">
            <h3>No items yet</h3>
            <p className="muted">Select a category, add items, then charge the order.</p>
          </article>
        ) : null}
        {cart.map((item) => (
          <article key={item.id} className="cart-row">
            <div>
              <h3>{item.name}</h3>
              <p className="muted">{formatCurrency(item.price)} each</p>
            </div>
            <div className="cart-controls">
              <button type="button" className="quantity-button" onClick={() => onDecrement(item.id)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button type="button" className="quantity-button" onClick={() => onIncrement(item.id)}>
                +
              </button>
              <button type="button" className="delete-item-button" onClick={() => setPendingRemoval(item)}>
                Delete
              </button>
              <strong>{formatCurrency(item.quantity * item.price)}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="summary-block">
        <div>
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <div>
          <span>VAT</span>
          <strong>{formatCurrency(DEMO_VAT)}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>

      <button type="button" className="primary-button complete-order-button" onClick={onCompleteOrder} disabled={!canCompleteOrder}>
        Complete Order
      </button>

      {pendingRemoval ? (
        <div className="item-remove-backdrop" role="presentation" onClick={() => setPendingRemoval(null)}>
          <section
            className="panel item-remove-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-item-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Remove Item</p>
                <h2 id="remove-item-title">{pendingRemoval.name}</h2>
              </div>
            </div>
            <p className="muted">Remove this item from the basket?</p>
            <div className="action-group">
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  onRemove(pendingRemoval.id);
                  setPendingRemoval(null);
                }}
              >
                Confirm Delete
              </button>
              <button type="button" className="secondary-button" onClick={() => setPendingRemoval(null)}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
