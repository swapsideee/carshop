import { create } from "zustand";
import { persist } from "zustand/middleware";

const generateOrderId = () => crypto.randomUUID?.() || Date.now();

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      pastOrders: [],

      addToCart: (product) => {
        if (!product?.id || !product?.price) return;

        const { cartItems } = get();
        const existingItem = cartItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cartItems: cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cartItems: [...cartItems, { ...product, quantity: 1 }],
          });
        }
      },

      decreaseQuantity: (id) => {
        const { cartItems } = get();
        const updated = cartItems
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0);

        set({ cartItems: updated });
      },

      removeFromCart: (id) => {
        const { cartItems } = get();
        set({
          cartItems: cartItems.filter((item) => item.id !== id),
        });
      },

      clearCart: () => set({ cartItems: [] }),

      saveOrder: (orderData) => {
        const { pastOrders } = get();
        const newOrder = {
          ...orderData,
          id: generateOrderId(),
        };

        set({ pastOrders: [...pastOrders, newOrder] });
      },
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;
