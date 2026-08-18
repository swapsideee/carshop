import type Stripe from 'stripe';
import { describe, expect, it } from 'vitest';

import {
  checkoutTokensMatch,
  parseCheckoutSessionVerification,
  serializeCheckoutSessionVerification,
} from '../sessionVerification';
import { sessionToClientVerification } from '../stripeMappers';

describe('checkout session verification', () => {
  it('serializes a browser-bound session proof and compares tokens safely', () => {
    const cookieValue = serializeCheckoutSessionVerification({
      sessionId: 'cs_test_123',
      token: 'a0c429ef-568d-4d93-b5df-9a9f72ae6a08',
    });

    expect(parseCheckoutSessionVerification(cookieValue)).toEqual({
      sessionId: 'cs_test_123',
      token: 'a0c429ef-568d-4d93-b5df-9a9f72ae6a08',
    });
    expect(checkoutTokensMatch('same-token', 'same-token')).toBe(true);
    expect(checkoutTokensMatch('same-token', 'another-token')).toBe(false);
    expect(parseCheckoutSessionVerification('not-a-cookie')).toBeNull();
  });

  it('does not expose internal Stripe metadata in a client verification response', () => {
    const session = {
      id: 'cs_test_123',
      amount_total: 1000,
      currency: 'uah',
      payment_status: 'paid',
      customer_email: 'buyer@example.com',
      metadata: {
        name: 'Ivan Petrenko',
        phone: '+380501234567',
        comment: 'Call me',
        checkout_verification_token: 'secret',
      },
      line_items: { data: [] },
    } as unknown as Stripe.Checkout.Session;

    const response = sessionToClientVerification(session);

    expect(response.customer).toEqual({
      name: 'Ivan Petrenko',
      phone: '+380501234567',
      comment: 'Call me',
    });
    expect(response).not.toHaveProperty('metadata');
  });
});
