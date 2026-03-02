import { AppState, MenuCategory, MenuItem, TableOption } from '../types/state';

export const tableOptions: TableOption[] = [
  { id: 'takeout', name: 'Takeout', seats: 0, status: 'open' },
  { id: 'table-01', name: 'Table 01', seats: 2, status: 'open' },
  { id: 'table-02', name: 'Table 02', seats: 4, status: 'open' },
  { id: 'table-03', name: 'Table 03', seats: 4, status: 'open' },
  { id: 'table-04', name: 'Table 04', seats: 6, status: 'open' },
  { id: 'table-05', name: 'Table 05', seats: 2, status: 'open' },
];

export const menuCategories: MenuCategory[] = [
  { id: 'coffee', name: 'Coffee' },
  { id: 'food', name: 'Kitchen' },
  { id: 'dessert', name: 'Bakery' },
  { id: 'cold', name: 'Cold Drinks' },
];

export const menuItems: MenuItem[] = [
  { id: 'flat-white', categoryId: 'coffee', name: 'Flat White', price: 4.5, accent: 'Warm pick' },
  { id: 'americano', categoryId: 'coffee', name: 'Americano', price: 3.8, accent: 'Fast seller' },
  { id: 'cappuccino', categoryId: 'coffee', name: 'Cappuccino', price: 4.2, accent: 'Foam bar' },
  { id: 'wrap', categoryId: 'food', name: 'Breakfast Wrap', price: 8.5, accent: 'Hot kitchen' },
  { id: 'toastie', categoryId: 'food', name: 'Mozzarella Toastie', price: 7.9, accent: 'Lunch rush' },
  { id: 'salad', categoryId: 'food', name: 'Chicken Caesar Salad', price: 10.5, accent: 'Healthy' },
  { id: 'muffin', categoryId: 'dessert', name: 'Blueberry Muffin', price: 3.5, accent: 'Bakery' },
  { id: 'cookie', categoryId: 'dessert', name: 'Double Choc Cookie', price: 2.9, accent: 'Add-on' },
  { id: 'brownie', categoryId: 'dessert', name: 'Salted Brownie', price: 3.9, accent: 'Sweet spot' },
  { id: 'iced-latte', categoryId: 'cold', name: 'Iced Latte', price: 4.9, accent: 'Popular' },
  { id: 'orange', categoryId: 'cold', name: 'Fresh Orange Juice', price: 4.4, accent: 'Pressed' },
  { id: 'sparkling', categoryId: 'cold', name: 'Sparkling Water', price: 2.5, accent: 'Chilled' },
];

export const initialState: AppState = {
  activeView: 'checkout',
  cashierName: null,
  selectedTableId: '',
  selectedCategoryId: 'coffee',
  tables: tableOptions,
  categories: menuCategories,
  menuItems,
  cart: [],
  selectedPaymentMethod: null,
  paymentStatus: 'idle',
  paymentMessage: 'Enter a PIN, choose a table, and add items to begin.',
  paymentScenario: 'success',
  transactions: [],
  activeTransactionId: null,
  lastCompletedTransactionId: null,
};
