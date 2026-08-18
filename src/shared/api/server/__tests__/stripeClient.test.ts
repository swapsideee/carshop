import { describe, expect, it } from 'vitest';

import { getStripe } from '../stripeClient';

describe('Stripe client', () => {
  it('uses the explicit caller-supplied key and caches clients by that key', () => {
    const checkoutClient = getStripe('sk_test_checkout');
    const webhookClient = getStripe('sk_test_webhook');

    expect(getStripe('sk_test_checkout')).toBe(checkoutClient);
    expect(webhookClient).not.toBe(checkoutClient);
  });
});
