export type AppView = 'checkout' | 'transactions' | 'overview';

export type PaymentMethod = 'cash' | 'card' | 'qr' | null;

export type PaymentStatus =
  | 'idle'
  | 'collecting'
  | 'processing'
  | 'success'
  | 'failed'
  | 'canceled'
  | 'timed_out';

export type DemoScenario = 'success' | 'declined' | 'timeout' | 'canceled';

export type TransactionStatus =
  | 'success'
  | 'failed'
  | 'canceled'
  | 'timed_out'
  | 'refunded'
  | 'voided';

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  categoryId: string;
  quantity: number;
  price: number;
}

export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  accent: string;
}

export interface TableOption {
  id: string;
  name: string;
  seats: number;
  status: 'open' | 'occupied' | 'reserved';
}

export interface TransactionLineItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  method: Exclude<PaymentMethod, null>;
  status: TransactionStatus;
  customerLabel: string;
  cashier: string;
  tableName?: string;
  orderItems?: TransactionLineItem[];
  failureReason?: string;
}

export interface AppState {
  activeView: AppView;
  cashierName: string | null;
  selectedTableId: string;
  selectedCategoryId: string;
  tables: TableOption[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  cart: CartItem[];
  selectedPaymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentMessage: string;
  paymentScenario: DemoScenario;
  transactions: Transaction[];
  activeTransactionId: string | null;
  lastCompletedTransactionId: string | null;
}

export type AppAction =
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_CASHIER'; payload: string | null }
  | { type: 'SELECT_TABLE'; payload: string }
  | { type: 'SELECT_CATEGORY'; payload: string }
  | { type: 'ADD_ITEM_TO_CART'; payload: string }
  | { type: 'INCREMENT_CART_ITEM'; payload: string }
  | { type: 'DECREMENT_CART_ITEM'; payload: string }
  | { type: 'REMOVE_CART_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SELECT_PAYMENT_METHOD'; payload: Exclude<PaymentMethod, null> }
  | { type: 'CLEAR_PAYMENT_METHOD' }
  | { type: 'SET_SCENARIO'; payload: DemoScenario }
  | { type: 'START_PAYMENT' }
  | { type: 'RESOLVE_PAYMENT' }
  | { type: 'RESET_FOR_NEW_SALE' }
  | { type: 'OPEN_TRANSACTION'; payload: string }
  | { type: 'CLOSE_TRANSACTION' }
  | { type: 'REFUND_TRANSACTION'; payload: string }
  | { type: 'VOID_TRANSACTION'; payload: string }
  | { type: 'LOAD_TRANSACTIONS'; payload: Transaction[] };
