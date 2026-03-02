import { useState } from 'react';
import { CartList } from '../components/CartList';
import { MenuCatalog } from '../components/MenuCatalog';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { PaymentStatusPanel } from '../components/PaymentStatusPanel';
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
  onSelectMethod: (method: 'cash' | 'card' | 'qr') => void;
  onStartPayment: () => void;
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
  onSelectMethod,
  onStartPayment,
  onResolvePayment,
  onNewSale,
  onScenarioChange,
}: CheckoutScreenProps) {
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);

  return (
    <>
      <div className="checkout-layout">
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
        <aside className="checkout-sidebar">
          <CartList
            selectedTableName={selectedTableName}
            cart={cart}
            total={cartTotal}
            canCompleteOrder={canStartPayment}
            onIncrement={onIncrementItem}
            onDecrement={onDecrementItem}
            onRemove={onRemoveItem}
            onCompleteOrder={() => setIsPaymentMethodOpen(true)}
          />
          <PaymentStatusPanel
            method={selectedPaymentMethod}
            status={paymentStatus}
            message={paymentMessage}
            scenario={paymentScenario}
            onScenarioChange={onScenarioChange}
            onResolve={onResolvePayment}
            onNewSale={onNewSale}
            onRetry={() => setIsPaymentMethodOpen(true)}
          />
        </aside>
      </div>
      <PaymentMethodSelector
        isOpen={isPaymentMethodOpen}
        onClose={() => setIsPaymentMethodOpen(false)}
        onSelect={(method) => {
          onSelectMethod(method);
          onStartPayment();
          setIsPaymentMethodOpen(false);
        }}
      />
    </>
  );
}
