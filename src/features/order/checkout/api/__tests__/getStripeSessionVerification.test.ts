import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { StripeSessionVerificationApiResult } from '../../model/apiTypes';
import { getStripeSessionVerification } from '../getStripeSessionVerification';

const fetchMock = vi.fn<typeof fetch>();

function createVerificationResult(): StripeSessionVerificationApiResult {
  return {
    ok: true,
    paid: true,
    id: 'cs_test_123',
    currency: 'uah',
    payment_status: 'paid',
    customer_email: 'buyer@example.com',
    customer: {
      name: 'Test buyer',
      phone: '+380501234567',
      comment: 'Call before delivery',
    },
    cartItems: [{ id: 'li_123', name: 'Product model', quantity: 2, price: 600 }],
    total: 1200,
  };
}

describe('getStripeSessionVerification', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the verified client contract with the existing request shape', async () => {
    const verification = createVerificationResult();
    fetchMock.mockResolvedValue(new Response(JSON.stringify(verification), { status: 200 }));

    await expect(getStripeSessionVerification('cs_test_123')).resolves.toEqual(verification);

    expect(fetchMock).toHaveBeenCalledWith('/api/stripe/session?session_id=cs_test_123');
  });

  it('rejects malformed and unsuccessful verification responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 }),
    );

    await expect(getStripeSessionVerification('cs_test_123')).rejects.toThrow('Forbidden');
  });
});
