import { AnimatePresence } from 'framer-motion';

import type { CartItem } from '@/features/cart';

import CartItemRow from './CartItemRow';

type CartItemsListProps = {
  items: CartItem[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  errorItemId: string | null;
  errorText: string;
};

export default function CartItemsList({
  items,
  onIncrement,
  onDecrement,
  onRemove,
  errorItemId,
  errorText,
}: CartItemsListProps) {
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
