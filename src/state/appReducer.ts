import { AppAction, AppState, Transaction } from '../types/state';
import { calculateCartTotal } from '../utils/pricing';
import { getOutcomeStatus, getStartStatus, getStatusMessage, getTransactionStatus } from '../utils/mockScenarios';

function getSelectedTableName(state: AppState): string {
  return state.tables.find((table) => table.id === state.selectedTableId)?.name ?? 'Takeout';
}

function createTransaction(state: AppState): Transaction | null {
  if (!state.selectedPaymentMethod || state.cart.length === 0 || !state.cashierName || !state.selectedTableId) {
    return null;
  }

  const amount = calculateCartTotal(state.cart);
  const id = `TXN-${Date.now()}`;
  const transactionStatus = getTransactionStatus(state.paymentScenario);
  const tableName = getSelectedTableName(state);
  const isTakeout = state.selectedTableId === 'takeout';

  return {
    id,
    timestamp: new Date().toISOString(),
    amount,
    method: state.selectedPaymentMethod,
    status: transactionStatus,
    customerLabel: state.selectedPaymentMethod === 'qr' ? `${tableName} QR guest` : isTakeout ? 'Takeout order' : `${tableName} dine-in`,
    cashier: state.cashierName,
    tableName,
    orderItems: state.cart.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    failureReason: transactionStatus === 'failed' ? 'Card was not approved' : undefined,
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'SET_CASHIER':
      return {
        ...state,
        cashierName: action.payload,
        paymentStatus: 'idle',
        paymentMessage: action.payload
          ? 'Choose takeout or table and add items to begin.'
          : 'Enter a PIN, choose takeout or table, and add items to begin.',
      };
    case 'SELECT_TABLE':
      return { ...state, selectedTableId: action.payload };
    case 'SELECT_CATEGORY':
      return { ...state, selectedCategoryId: action.payload };
    case 'ADD_ITEM_TO_CART': {
      const menuItem = state.menuItems.find((item) => item.id === action.payload);
      if (!menuItem) {
        return state;
      }

      const existingItem = state.cart.find((item) => item.menuItemId === menuItem.id);
      const cart = existingItem
        ? state.cart.map((item) =>
            item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [
            ...state.cart,
            {
              id: `cart-${menuItem.id}`,
              menuItemId: menuItem.id,
              name: menuItem.name,
              categoryId: menuItem.categoryId,
              quantity: 1,
              price: menuItem.price,
            },
          ];

      return {
        ...state,
        cart,
        paymentStatus: 'idle',
        paymentMessage: 'Ready to take payment.',
      };
    }
    case 'INCREMENT_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    case 'DECREMENT_CART_ITEM':
      return {
        ...state,
        cart: state.cart
          .map((item) => (item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity > 0),
      };
    case 'REMOVE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        selectedPaymentMethod: null,
        paymentStatus: 'idle',
        paymentMessage: state.cashierName ? 'Choose takeout or table and add items to begin.' : 'Enter a PIN to begin.',
      };
    case 'SELECT_PAYMENT_METHOD':
      return {
        ...state,
        selectedPaymentMethod: action.payload,
        paymentStatus: 'idle',
        paymentMessage: 'Ready to take payment.',
      };
    case 'CLEAR_PAYMENT_METHOD':
      return {
        ...state,
        selectedPaymentMethod: null,
        paymentStatus: 'idle',
        paymentMessage: 'Ready to take payment.',
      };
    case 'SET_SCENARIO':
      return { ...state, paymentScenario: action.payload };
    case 'START_PAYMENT':
      if (!state.cashierName) {
        return {
          ...state,
          paymentStatus: 'failed',
          paymentMessage: 'Enter a valid cashier PIN before taking payment.',
        };
      }

      if (!state.selectedTableId) {
        return {
          ...state,
          paymentStatus: 'failed',
          paymentMessage: 'Choose takeout or table before taking payment.',
        };
      }

      if (state.cart.length === 0) {
        return {
          ...state,
          paymentStatus: 'failed',
          paymentMessage: 'Add items before taking payment.',
        };
      }

      return {
        ...state,
        paymentStatus: getStartStatus(state.selectedPaymentMethod),
        paymentMessage: getStatusMessage(
          state.selectedPaymentMethod,
          getStartStatus(state.selectedPaymentMethod),
          state.paymentScenario,
        ),
      };
    case 'RESOLVE_PAYMENT': {
      const outcomeStatus = getOutcomeStatus(state.paymentScenario);
      const nextTransaction = createTransaction(state);
      const nextTransactions = nextTransaction ? [nextTransaction, ...state.transactions] : state.transactions;

      return {
        ...state,
        paymentStatus: outcomeStatus,
        paymentMessage: getStatusMessage(state.selectedPaymentMethod, outcomeStatus, state.paymentScenario),
        transactions: nextTransactions,
        lastCompletedTransactionId: nextTransaction?.id ?? state.lastCompletedTransactionId,
      };
    }
    case 'RESET_FOR_NEW_SALE':
      return {
        ...state,
        paymentStatus: 'idle',
        paymentMessage: state.cashierName ? 'Choose takeout or table and add items for the next sale.' : 'Enter a PIN to begin.',
        paymentScenario: 'success',
        selectedPaymentMethod: null,
        selectedTableId: 'takeout',
        cart: [],
        activeTransactionId: null,
      };
    case 'OPEN_TRANSACTION':
      return {
        ...state,
        activeView: 'transactions',
        activeTransactionId: action.payload,
      };
    case 'CLOSE_TRANSACTION':
      return { ...state, activeTransactionId: null };
    case 'REFUND_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload ? { ...transaction, status: 'refunded' } : transaction,
        ),
      };
    case 'VOID_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload ? { ...transaction, status: 'voided' } : transaction,
        ),
      };
    case 'LOAD_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    default:
      return state;
  }
}
