'use client';

import { motion } from 'framer-motion';
import { SquareChartGantt } from 'lucide-react';

import { selectCartItems, selectCartTotal, useCartStore } from '@/features/cart';

import { useCartLineError } from '../model/useCartLineError';
import CartEmptyState from './CartEmptyState';
import CartItemsList from './CartItemsList';
import CartSummary from './CartSummary';

export default function CartView() {
  const cartItems = useCartStore(selectCartItems);
  const total = useCartStore(selectCartTotal);

  const pastOrders = useCartStore((s) => s.pastOrders);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const { errorItemId, errorText, showLineError } = useCartLineError({ timeoutMs: 3000 });

  const onIncrement = (id) => {
    const res = increment(id);
    if (!res?.ok) showLineError(id, res?.message);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-10 text-center text-gray-900 flex items-center justify-center gap-2">
        <SquareChartGantt className="flex w-9 h-9 shrink-0 self-start" />
        Обранi товари
      </h1>

      {cartItems.length === 0 ? (
        <CartEmptyState pastOrders={pastOrders} />
      ) : (
        <div className="space-y-6">
          <CartItemsList
            items={cartItems}
            onIncrement={onIncrement}
            onDecrement={decrement}
            onRemove={removeFromCart}
            errorItemId={errorItemId}
            errorText={errorText}
          />

          <motion.div />

          <CartSummary total={total} onClear={clearCart} />
        </div>
      )}
    </div>
  );
}
