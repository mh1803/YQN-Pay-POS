import { useEffect, useMemo, useReducer, useState } from 'react';
import { CashierAccessPanel } from './components/CashierAccessPanel';
import { Header } from './components/Header';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OverviewScreen } from './screens/OverviewScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { appReducer } from './state/appReducer';
import { initialState } from './state/initialState';
import { loadTransactions, saveTransactions } from './state/storage';
import { DemoScenario, PaymentMethod, Transaction } from './types/state';
import { formatCurrency } from './utils/currency';
import { formatDateTime } from './utils/dates';
import { getProcessingDelay } from './utils/mockScenarios';
import { calculateCartTotal } from './utils/pricing';
import { formatPaymentMethodLabel, formatServiceLabel, formatTransactionStatus } from './utils/transactions';

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSignOutPending, setIsSignOutPending] = useState(false);

  const cashierByPin: Record<string, string> = {
    '0000': 'Mahdi',
    '1111': 'Adema',
  };

  useEffect(() => {
    dispatch({ type: 'LOAD_TRANSACTIONS', payload: loadTransactions() });
  }, []);

  useEffect(() => {
    saveTransactions(state.transactions);
  }, [state.transactions]);

  useEffect(() => {
    if (state.paymentStatus !== 'processing' && state.paymentStatus !== 'collecting') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'RESOLVE_PAYMENT' });
    }, getProcessingDelay(state.selectedPaymentMethod));

    return () => window.clearTimeout(timer);
  }, [state.paymentStatus, state.selectedPaymentMethod, state.paymentScenario]);

  const cartTotal = useMemo(() => calculateCartTotal(state.cart), [state.cart]);
  const selectedTableName = useMemo(
    () => state.tables.find((table) => table.id === state.selectedTableId)?.name ?? 'Takeout',
    [state.selectedTableId, state.tables],
  );

  const handlers = {
    setView: (view: 'checkout' | 'transactions' | 'overview') => dispatch({ type: 'SET_VIEW', payload: view }),
    selectTable: (tableId: string) => dispatch({ type: 'SELECT_TABLE', payload: tableId }),
    selectCategory: (categoryId: string) => dispatch({ type: 'SELECT_CATEGORY', payload: categoryId }),
    addItem: (menuItemId: string) => dispatch({ type: 'ADD_ITEM_TO_CART', payload: menuItemId }),
    incrementItem: (itemId: string) => dispatch({ type: 'INCREMENT_CART_ITEM', payload: itemId }),
    decrementItem: (itemId: string) => dispatch({ type: 'DECREMENT_CART_ITEM', payload: itemId }),
    removeItem: (itemId: string) => dispatch({ type: 'REMOVE_CART_ITEM', payload: itemId }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    selectMethod: (method: Exclude<PaymentMethod, null>) =>
      dispatch({ type: 'SELECT_PAYMENT_METHOD', payload: method }),
    clearMethod: () => dispatch({ type: 'CLEAR_PAYMENT_METHOD' }),
    setScenario: (scenario: DemoScenario) => dispatch({ type: 'SET_SCENARIO', payload: scenario }),
    startPayment: () => dispatch({ type: 'START_PAYMENT' }),
    resolvePayment: () => dispatch({ type: 'RESOLVE_PAYMENT' }),
    newSale: () => dispatch({ type: 'RESET_FOR_NEW_SALE' }),
    openTransaction: (id: string) => dispatch({ type: 'OPEN_TRANSACTION', payload: id }),
    closeTransaction: () => dispatch({ type: 'CLOSE_TRANSACTION' }),
    refundTransaction: (id: string) => dispatch({ type: 'REFUND_TRANSACTION', payload: id }),
    voidTransaction: (id: string) => dispatch({ type: 'VOID_TRANSACTION', payload: id }),
  };

  const handlePinSubmit = () => {
    const cashierName = cashierByPin[pinValue];

    if (!cashierName) {
      setPinError('PIN not recognized. Use a valid cashier PIN.');
      return;
    }

    dispatch({ type: 'SET_CASHIER', payload: cashierName });
    setPinError('');
    setPinValue('');
  };

  const handlePinClear = () => {
    setPinValue('');
    setPinError('');
    dispatch({ type: 'SET_CASHIER', payload: null });
  };

  const handlePrintTransaction = (transaction: Transaction) => {
    const receiptWindow = window.open('', '_blank', 'width=360,height=640');

    if (!receiptWindow) {
      return;
    }

    receiptWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Receipt ${transaction.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 24px;
              color: #203247;
            }
            .receipt {
              display: grid;
              gap: 12px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              gap: 16px;
            }
            .muted {
              color: #62768c;
              font-size: 12px;
            }
            h1, h2, p {
              margin: 0;
            }
            .total {
              padding-top: 12px;
              border-top: 1px dashed #9ebfdf;
              font-size: 20px;
              font-weight: 700;
            }
          </style>
        </head>
        <body>
          <section class="receipt">
            <h1>YQN Pay POS</h1>
            <p class="muted">Receipt copy</p>
            <div class="row"><span>Transaction</span><strong>${transaction.id}</strong></div>
            <div class="row"><span>Date</span><strong>${formatDateTime(transaction.timestamp)}</strong></div>
            <div class="row"><span>Status</span><strong>${formatTransactionStatus(transaction.status)}</strong></div>
            <div class="row"><span>Method</span><strong>${formatPaymentMethodLabel(transaction.method)}</strong></div>
            <div class="row"><span>Service</span><strong>${formatServiceLabel(transaction)}</strong></div>
            <div class="row"><span>Cashier</span><strong>${transaction.cashier}</strong></div>
            ${
              transaction.orderItems && transaction.orderItems.length > 0
                ? `
            <div style="padding-top:12px;border-top:1px dashed #9ebfdf;">
              <p class="muted" style="margin-bottom:8px;">Order</p>
              ${transaction.orderItems
                .map(
                  (item) =>
                    `<div class="row"><span>${item.quantity}x ${item.name}</span><strong>${formatCurrency(item.price * item.quantity)}</strong></div>`,
                )
                .join('')}
            </div>`
                : ''
            }
            <div class="row total"><span>Total</span><strong>${formatCurrency(transaction.amount)}</strong></div>
          </section>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
  };

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <Header
        activeView={state.activeView}
        cashierName={state.cashierName}
        terminalName="Counter 01"
        onChangeView={handlers.setView}
        onSignOut={() => setIsSignOutPending(true)}
      />

      <main className={state.cashierName ? 'app-content' : 'app-content app-content-locked'}>
        {state.activeView === 'checkout' ? (
          <CheckoutScreen
            cartTotal={cartTotal}
            selectedTableId={state.selectedTableId}
            selectedTableName={selectedTableName}
            selectedCategoryId={state.selectedCategoryId}
            tables={state.tables}
            categories={state.categories}
            menuItems={state.menuItems}
            cart={state.cart}
            selectedPaymentMethod={state.selectedPaymentMethod}
            paymentStatus={state.paymentStatus}
            paymentMessage={state.paymentMessage}
            paymentScenario={state.paymentScenario}
            canStartPayment={state.cart.length > 0 && !!state.selectedTableId && !!state.cashierName}
            onSelectTable={handlers.selectTable}
            onSelectCategory={handlers.selectCategory}
            onAddItem={handlers.addItem}
            onIncrementItem={handlers.incrementItem}
            onDecrementItem={handlers.decrementItem}
            onRemoveItem={handlers.removeItem}
            onClearCart={handlers.clearCart}
            onSelectMethod={handlers.selectMethod}
            onClearMethod={handlers.clearMethod}
            onResolvePayment={handlers.resolvePayment}
            onNewSale={handlers.newSale}
            onScenarioChange={handlers.setScenario}
          />
        ) : null}

        {state.activeView === 'transactions' ? (
          <TransactionsScreen
            transactions={state.transactions}
            activeTransactionId={state.activeTransactionId}
            onOpenTransaction={handlers.openTransaction}
            onPrintTransaction={handlePrintTransaction}
            onRefundTransaction={handlers.refundTransaction}
            onVoidTransaction={handlers.voidTransaction}
          />
        ) : null}

        {state.activeView === 'overview' ? <OverviewScreen transactions={state.transactions} /> : null}
      </main>

      {!state.cashierName ? (
        <CashierAccessPanel
          terminalName="Counter 01"
          pinValue={pinValue}
          pinError={pinError}
          onPinChange={(value) => {
            setPinValue(value.replace(/\D/g, '').slice(0, 4));
            if (pinError) {
              setPinError('');
            }
          }}
          onSubmit={handlePinSubmit}
        />
      ) : null}

      {isSignOutPending ? (
        <div className="item-remove-backdrop" role="presentation" onClick={() => setIsSignOutPending(false)}>
          <section
            className="panel item-remove-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Sign Out</p>
                <h2 id="signout-confirm-title">Sign out of this terminal?</h2>
              </div>
            </div>
            <p className="muted">This will lock the POS and return to PIN entry.</p>
            <div className="action-group">
              <button
                type="button"
                className="secondary-button destructive-button"
                onClick={() => {
                  handlePinClear();
                  setIsSignOutPending(false);
                }}
              >
                Confirm Sign Out
              </button>
              <button type="button" className="secondary-button" onClick={() => setIsSignOutPending(false)}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default App;
