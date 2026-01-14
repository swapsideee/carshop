export const selectCartItems = (state) => state.cartItems;

export const selectCartCount = (state) =>
  (state.cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

export const selectCartTotal = (state) =>
  (state.cartItems || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0,
  );
