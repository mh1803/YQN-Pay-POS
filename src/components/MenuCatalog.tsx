import { useState } from 'react';
import { MenuCategory, MenuItem } from '../types/state';
import { formatCurrency } from '../utils/currency';

interface MenuCatalogProps {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onAddItem: (menuItemId: string) => void;
}

export function MenuCatalog({
  categories,
  menuItems,
  selectedCategoryId,
  onSelectCategory,
  onAddItem,
}: MenuCatalogProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const visibleItems = menuItems.filter((item) => item.categoryId === selectedCategoryId);

  const closeModal = () => {
    setSelectedItem(null);
    setQuantity(1);
  };

  const confirmAdd = () => {
    if (!selectedItem) {
      return;
    }

    for (let index = 0; index < quantity; index += 1) {
      onAddItem(selectedItem.id);
    }

    closeModal();
  };

  return (
    <>
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Menu Builder</p>
            <h2>Add items by category</h2>
          </div>
        </div>

        <div className="category-row">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={selectedCategoryId === category.id ? 'category-chip active' : 'category-chip'}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="menu-card"
              onClick={() => {
                setSelectedItem(item);
                setQuantity(1);
              }}
            >
              <div>
                <p className="menu-accent">{item.accent}</p>
                <h3>{item.name}</h3>
              </div>
              <div className="menu-card-footer">
                <strong>{formatCurrency(item.price)}</strong>
                <span>Add</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedItem ? (
        <div className="item-quantity-backdrop" role="presentation" onClick={closeModal}>
          <section
            className="panel item-quantity-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-quantity-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Add Item</p>
                <h2 id="item-quantity-title">{selectedItem.name}</h2>
              </div>
              <button type="button" className="secondary-button" onClick={closeModal}>
                Close
              </button>
            </div>

            <p className="muted">Choose quantity before adding to the basket.</p>

            <div className="quantity-picker">
              <button
                type="button"
                className="quantity-button quantity-button-large"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                -
              </button>
              <div className="quantity-value">
                <strong>{quantity}</strong>
                <span>{formatCurrency(selectedItem.price)} each</span>
              </div>
              <button
                type="button"
                className="quantity-button quantity-button-large"
                onClick={() => setQuantity((current) => current + 1)}
              >
                +
              </button>
            </div>

            <div className="quantity-summary">
              <span>Total to add</span>
              <strong>{formatCurrency(selectedItem.price * quantity)}</strong>
            </div>

            <div className="action-group">
              <button type="button" className="primary-button" onClick={confirmAdd}>
                Add to Basket
              </button>
              <button type="button" className="secondary-button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
