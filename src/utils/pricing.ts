import { CartItem } from '../types/state';

export const DEMO_VAT = 1.95;

export function calculateCartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateCartTotal(cart: CartItem[]): number {
  const subtotal = calculateCartSubtotal(cart);
  return subtotal > 0 ? subtotal + DEMO_VAT : 0;
}
