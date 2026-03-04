import { CartItem } from '../types/state';

export function calculateCartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateCartTotal(cart: CartItem[]): number {
  return calculateCartSubtotal(cart);
}
