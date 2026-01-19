'use client';

import { AnimatePresence } from 'framer-motion';

import CartItemRow from './CartItemRow';

export default function CartItemsList({
  items,
  onIncrement,
  onDecrement,
  onRemove,
  errorItemId,
  errorText,
}) {
  return (
    <AnimatePresence>
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onDecrement={() => onDecrement(item.id)}
          onIncrement={() => onIncrement(item.id)}
          onRemove={() => onRemove(item.id)}
          hasError={errorItemId === item.id}
          errorText={errorText}
        />
      ))}
    </AnimatePresence>
  );
}
