import { useState } from 'react';
import { CartList } from '../components/CartList';
import { MenuCatalog } from '../components/MenuCatalog';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { TableSelector } from '../components/TableSelector';
import { CartItem, DemoScenario, MenuCategory, MenuItem, PaymentMethod, PaymentStatus, TableOption } from '../types/state';

interface CheckoutScreenProps {
  cartTotal: number;
  selectedTableId: string;
  selectedTableName: string;
  selectedCategoryId: string;
  tables: TableOption[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  cart: CartItem[];
  selectedPaymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentMessage: string;
  paymentScenario: DemoScenario;
  canStartPayment: boolean;
  onSelectTable: (tableId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onAddItem: (menuItemId: string) => void;
  onIncrementItem: (itemId: string) => void;
  onDecrementItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onSelectMethod: (method: 'cash' | 'card' | 'qr') => void;
  onClearMethod: () => void;
  onResolvePayment: () => void;
  onNewSale: () => void;
  onScenarioChange: (scenario: DemoScenario) => void;
}

export function CheckoutScreen({
  cartTotal,
  selectedTableId,
  selectedTableName,
  selectedCategoryId,
  tables,
  categories,
  menuItems,
  cart,
  selectedPaymentMethod,
  paymentStatus,
  paymentMessage,
  paymentScenario,
  canStartPayment,
  onSelectTable,
  onSelectCategory,
  onAddItem,
  onIncrementItem,
  onDecrementItem,
  onRemoveItem,
  onClearCart,
  onSelectMethod,
  onClearMethod,
  onResolvePayment,
  onNewSale,
  onScenarioChange,
}: CheckoutScreenProps) {
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);

  return (
    <>
      <div className="checkout-layout">
        <aside className="checkout-sidebar">
          <CartList
            selectedTableName={selectedTableName}
            cart={cart}
            total={cartTotal}
            canCompleteOrder={canStartPayment}
            showCompleteOrder
            onIncrement={onIncrementItem}
            onDecrement={onDecrementItem}
            onRemove={onRemoveItem}
            onClearCart={onClearCart}
            onCompleteOrder={() => setIsPaymentMethodOpen(true)}
          />
        </aside>
        <div className="checkout-main">
          <TableSelector
            tables={tables}
            selectedTableId={selectedTableId}
            selectedTableName={selectedTableName}
            onSelectTable={onSelectTable}
          />
          <MenuCatalog
            categories={categories}
            menuItems={menuItems}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
            onAddItem={onAddItem}
          />
        </div>
      </div>
      <PaymentMethodSelector
        isOpen={isPaymentMethodOpen}
        total={cartTotal}
        selectedMethod={selectedPaymentMethod}
        paymentStatus={paymentStatus}
        paymentScenario={paymentScenario}
        onClose={() => setIsPaymentMethodOpen(false)}
        onSelect={(method) => {
          onSelectMethod(method);
        }}
        onResolve={onResolvePayment}
        onNewSale={() => {
          onNewSale();
          setIsPaymentMethodOpen(false);
        }}
        onScenarioChange={onScenarioChange}
        onChangeMethod={onClearMethod}
      />
    </>
  );
}
