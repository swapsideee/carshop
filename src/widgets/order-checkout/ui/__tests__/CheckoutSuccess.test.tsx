import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SaveOrderInput } from '@/features/cart';

import CheckoutSuccess from '../CheckoutSuccess';

const order: SaveOrderInput = {
  items: [{ id: 'li_123', name: 'Product model', quantity: 2, price: 600 }],
  total: 1200,
  name: 'Test buyer',
  phone: '+380501234567',
  email: 'buyer@example.com',
  comment: 'Call before delivery',
  createdAt: '2026-08-20T12:00:00.000Z',
  paid: true,
  stripeSessionId: 'cs_test_123',
};

describe('CheckoutSuccess', () => {
  it('renders the unpersisted paid order snapshot', () => {
    render(<CheckoutSuccess order={order} />);

    expect(screen.getByText('Test buyer')).toBeInTheDocument();
    expect(screen.getByText(/Product model 2/)).toBeInTheDocument();
    expect(screen.getAllByText(/1200/)).toHaveLength(2);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/cart');
  });
});
