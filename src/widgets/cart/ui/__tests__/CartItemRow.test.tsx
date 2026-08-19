import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { CartItem } from '@/features/cart';

import CartItemRow from '../CartItemRow';

const item: CartItem = {
  id: '42-pair',
  productId: 42,
  option: 'pair',
  price: 600,
  quantity: 1,
  name: 'Product model (Пара)',
  image: '/product.jpg',
};

describe('CartItemRow', () => {
  it('keeps the quantity controls wired to the supplied cart actions', async () => {
    const user = userEvent.setup();
    const onIncrement = vi.fn();
    const onDecrement = vi.fn();
    const onRemove = vi.fn();

    render(
      <CartItemRow
        item={item}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
        hasError
        errorText="Maximum quantity reached"
      />,
    );

    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
    expect(screen.getByText('Maximum quantity reached')).toBeInTheDocument();
    expect(screen.getByText(/600/)).toBeInTheDocument();

    await user.click(screen.getByLabelText('Increase quantity'));
    await user.click(screen.getByLabelText('Remove item'));

    expect(onIncrement).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onDecrement).not.toHaveBeenCalled();
  });
});
