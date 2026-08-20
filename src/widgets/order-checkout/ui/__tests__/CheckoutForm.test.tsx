import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { UseCheckoutResult } from '@/features/order/checkout';

import CheckoutForm from '../CheckoutForm';

const cartItems: UseCheckoutResult['cartItems'] = [
  {
    id: '42-pair',
    productId: 42,
    option: 'pair',
    price: 600,
    quantity: 2,
    name: 'Product model (Пара)',
  },
  {
    id: '43-set',
    productId: 43,
    option: 'set',
    price: 0,
  },
];

const form: UseCheckoutResult['form'] = {
  name: 'Test customer',
  phone: '+380000000000',
  email: 'customer@example.com',
  comment: 'Delivery comment',
};

describe('CheckoutForm', () => {
  it('renders cart fallbacks and keeps the form controlled', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <CheckoutForm
        cartItems={cartItems}
        total={1200}
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        isSubmitting={false}
      />,
    );

    const cartLines = screen.getAllByRole('listitem');

    expect(cartLines).toHaveLength(2);
    expect(cartLines[0]).toHaveTextContent('Product model (Пара) 2 шт.');
    expect(cartLines[1]).toHaveTextContent('Товар 1 шт.');
    expect(screen.getAllByText(/1200/)).toHaveLength(2);
    expect(screen.getByDisplayValue('Test customer')).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('Test customer'), {
      target: { value: 'Next customer' },
    });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(onChange).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('disables the existing form controls while submitting', () => {
    const { container } = render(
      <CheckoutForm
        cartItems={cartItems}
        total={1200}
        form={form}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting
      />,
    );

    const checkoutForm = container.querySelector('form') as HTMLFormElement;

    expect(checkoutForm).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
    screen.getAllByRole('textbox').forEach((control) => expect(control).toBeDisabled());
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
});
