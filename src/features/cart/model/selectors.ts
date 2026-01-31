import type { CartStore } from './types';

export const selectCartItems = (state: CartStore) => state.cartItems;

export const selectCartCount = (state: CartStore) =>
  (state.cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

export const selectCartTotal = (state: CartStore) =>
  (state.cartItems || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0,
  );
