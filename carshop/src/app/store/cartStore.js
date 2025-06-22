import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
    persist(
        (set) => ({
            cartItems: [],
            pastOrders: [],

            addToCart: (product) =>
                set((state) => {
                    if (!product?.id || !product?.price) return state;

                    const existing = state.cartItems.find((item) => item.id === product.id);
                    if (existing) {
                        return {
                            cartItems: state.cartItems.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }

                    return {
                        cartItems: [...state.cartItems, { ...product, quantity: 1 }],
                    };
                }),

            decreaseQuantity: (id) =>
                set((state) => ({
                    cartItems: state.cartItems
                        .map((item) =>
                            item.id === id
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                })),

            removeFromCart: (id) =>
                set((state) => ({
                    cartItems: state.cartItems.filter((item) => item.id !== id),
                })),

            clearCart: () => set({ cartItems: [] }),

            saveOrder: (orderData) =>
                set((state) => ({
                    pastOrders: [
                        ...state.pastOrders,
                        {
                            ...orderData,
                            id: crypto.randomUUID?.() || Date.now(),
                        },
                    ],
                })),
        }),
        {
            name: "cart-storage",
        }
    )
);

export default useCartStore;
