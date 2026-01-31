import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartActionResult, CartItem, CartStore } from './types';

const generateOrderId = (): string =>
  (globalThis.crypto?.randomUUID?.() as string | undefined) ?? String(Date.now());

const MAX_QTY_PER_LINE = 10;

const ok = (extra: Record<string, unknown> = {}): CartActionResult => ({ ok: true, ...extra });

const fail = (message: string, extra: Record<string, unknown> = {}): CartActionResult => ({
  ok: false,
  message,
  ...extra,
});

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      pastOrders: [],

      addToCart: (product: CartItem) => {
        if (!product?.id) return fail('Некоректний товар: немає id');
        if (product?.price == null) return fail('Некоректний товар: немає ціни');

        const { cartItems } = get();
        const idx = cartItems.findIndex((i) => i.id === product.id);

        if (idx !== -1) {
          const current = cartItems[idx];
          if (!current) return fail('Товар не знайдено в кошику');

          if ((current.quantity || 0) >= MAX_QTY_PER_LINE) {
            return fail(`Максимум ${MAX_QTY_PER_LINE} одиниць цього товару`);
          }

          const next = cartItems.map((item, i) =>
            i === idx ? { ...item, quantity: (item.quantity || 0) + 1 } : item,
          );

          set({ cartItems: next });
          return ok();
        }

        set({
          cartItems: [...cartItems, { ...product, quantity: 1 }],
        });
        return ok();
      },

      increment: (id: string) => {
        const { cartItems } = get();
        const idx = cartItems.findIndex((i) => i.id === id);
        if (idx === -1) return fail('Товар не знайдено в кошику');

        const current = cartItems[idx];
        if (!current) return fail('Товар не знайдено в кошику');

        if ((current.quantity || 0) >= MAX_QTY_PER_LINE) {
          return fail(`Максимум ${MAX_QTY_PER_LINE} одиниць цього товару`);
        }

        const next = cartItems.map((item, i) =>
          i === idx ? { ...item, quantity: (item.quantity || 0) + 1 } : item,
        );

        set({ cartItems: next });
        return ok();
      },

      decrement: (id: string) => {
        const { cartItems } = get();
        const next = cartItems
          .map((item) => (item.id === id ? { ...item, quantity: (item.quantity || 0) - 1 } : item))
          .filter((item) => (item.quantity || 0) > 0);

        set({ cartItems: next });
        return ok();
      },

      removeFromCart: (id: string) => {
        const { cartItems } = get();
        set({ cartItems: cartItems.filter((i) => i.id !== id) });
        return ok();
      },

      clearCart: () => {
        set({ cartItems: [] });
        return ok();
      },

      saveOrder: (orderData: Record<string, unknown>) => {
        const { pastOrders } = get();
        const newOrder = { ...orderData, id: generateOrderId() };
        set({ pastOrders: [...pastOrders, newOrder] });
        return ok({ orderId: String(newOrder.id) });
      },
    }),
    { name: 'cart-storage' },
  ),
);

export default useCartStore;
