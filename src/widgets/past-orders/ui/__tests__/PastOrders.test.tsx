import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PastOrder } from '@/features/cart';

import PastOrders from '../PastOrders';

const orders: PastOrder[] = [
  {
    id: 'local-order-1',
    items: [{ id: 'li_123', name: 'Older product', quantity: 1, price: 600 }],
    total: 600,
    name: 'Older customer',
    phone: '+380501111111',
    email: 'older@example.com',
    comment: '',
    createdAt: '2026-08-19T12:00:00.000Z',
    paid: true,
    stripeSessionId: 'cs_test_older',
  },
  {
    id: 'local-order-2',
    items: [{ id: 'li_456', name: 'Newest product', quantity: 2, price: 700 }],
    total: 1400,
    name: 'Newest customer',
    phone: '+380502222222',
    email: 'newest@example.com',
    comment: 'Leave at reception',
    createdAt: '2026-08-20T12:00:00.000Z',
    paid: true,
    stripeSessionId: 'cs_test_newer',
  },
];

describe('PastOrders', () => {
  it('renders persisted orders in the existing newest-first order', () => {
    render(<PastOrders orders={orders} />);

    const cards = screen.getAllByText(/customer/);
    expect(cards[0]).toHaveTextContent('Newest customer');
    expect(cards[1]).toHaveTextContent('Older customer');
    expect(screen.getByText(/Newest product 2/)).toBeInTheDocument();
    expect(screen.getByText(/Older product 1/)).toBeInTheDocument();
    expect(screen.getAllByText(/1400/)).toHaveLength(2);
  });
});
