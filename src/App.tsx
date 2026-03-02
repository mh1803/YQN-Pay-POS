import { useEffect, useMemo, useReducer, useState } from 'react';
import { CashierAccessPanel } from './components/CashierAccessPanel';
import { Header } from './components/Header';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OverviewScreen } from './screens/OverviewScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { appReducer } from './state/appReducer';
import { initialState } from './state/initialState';
import { loadTransactions, saveTransactions } from './state/storage';
import { DemoScenario, PaymentMethod } from './types/state';
import { getProcessingDelay } from './utils/mockScenarios';
import { calculateCartTotal } from './utils/pricing';

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');

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
    () => state.tables.find((table) => table.id === state.selectedTableId)?.name ?? 'Counter',
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
    selectMethod: (method: Exclude<PaymentMethod, null>) =>
      dispatch({ type: 'SELECT_PAYMENT_METHOD', payload: method }),
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

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <Header
        activeView={state.activeView}
        cashierName={state.cashierName}
        terminalName="Counter 01"
        onChangeView={handlers.setView}
        onSignOut={handlePinClear}
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
            onSelectMethod={handlers.selectMethod}
            onStartPayment={handlers.startPayment}
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
            onCloseTransaction={handlers.closeTransaction}
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
    </div>
  );
}

export default App;
