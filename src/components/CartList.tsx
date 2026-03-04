import { useState } from 'react';
import { CartItem } from '../types/state';
import { formatCurrency } from '../utils/currency';

interface CartListProps {
  selectedTableName: string;
  cart: CartItem[];
  total: number;
  canCompleteOrder: boolean;
  showCompleteOrder: boolean;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onClearCart: () => void;
  onCompleteOrder: () => void;
}

export function CartList({
  selectedTableName,
  cart,
  total,
  canCompleteOrder,
  showCompleteOrder,
  onIncrement,
  onDecrement,
  onRemove,
  onClearCart,
  onCompleteOrder,
}: CartListProps) {
  const [pendingRemoval, setPendingRemoval] = useState<CartItem | null>(null);
  const [isClearPending, setIsClearPending] = useState(false);

  return (
    <section className="panel cart-panel">
      <div className="section-heading">
        <div>
          <h2 className="basket-title">Current Basket</h2>
        </div>
        <div className="basket-heading-actions">
          <span className="badge">{selectedTableName}</span>
          <button
            type="button"
            className="basket-clear-icon"
            onClick={() => setIsClearPending(true)}
            aria-label="Clear basket"
            disabled={cart.length === 0}
          >
            X
          </button>
        </div>
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
            </div>
            <div className="cart-controls">
              <button
                type="button"
                className="quantity-button quantity-button-decrease"
                onClick={() => onDecrement(item.id)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                className="quantity-button quantity-button-increase"
                onClick={() => onIncrement(item.id)}
              >
                +
              </button>
              <button
                type="button"
                className="delete-item-button"
                onClick={() => setPendingRemoval(item)}
                aria-label={`Delete ${item.name}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="delete-item-icon">
                  <path
                    d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h2v8H7V9Zm4 0h2v8h-2V9Zm4 0h2v8h-2V9ZM6 21V7h12v14H6Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <strong>{formatCurrency(item.quantity * item.price)}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="summary-block">
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>

      {showCompleteOrder ? (
        <button
          type="button"
          className="primary-button complete-order-button"
          onClick={onCompleteOrder}
          disabled={!canCompleteOrder}
        >
          Complete Order
        </button>
      ) : null}

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
                className="secondary-button destructive-button"
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

      {isClearPending ? (
        <div className="item-remove-backdrop" role="presentation" onClick={() => setIsClearPending(false)}>
          <section
            className="panel item-remove-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-basket-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Clear Basket</p>
                <h2 id="clear-basket-title">Clear all items?</h2>
              </div>
            </div>
            <p className="muted">This will remove the full basket.</p>
            <div className="action-group">
              <button
                type="button"
                className="secondary-button destructive-button"
                onClick={() => {
                  onClearCart();
                  setIsClearPending(false);
                }}
              >
                Confirm Clear
              </button>
              <button type="button" className="secondary-button" onClick={() => setIsClearPending(false)}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
