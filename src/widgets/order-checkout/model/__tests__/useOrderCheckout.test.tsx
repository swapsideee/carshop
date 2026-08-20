import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { SaveOrderInput } from '@/features/cart';
import type {
  StripeSessionVerificationApiResult,
  UseCheckoutResult,
} from '@/features/order/checkout';

const mocks = vi.hoisted(() => ({
  clearCart: vi.fn(),
  getStripeSessionVerification: vi.fn(),
  saveOrder: vi.fn(),
  useCartStore: vi.fn(),
  useCheckout: vi.fn(),
}));

vi.mock('@/features/cart', () => ({
  useCartStore: mocks.useCartStore,
}));

vi.mock('@/features/order/checkout', () => ({
  getStripeSessionVerification: mocks.getStripeSessionVerification,
  useCheckout: mocks.useCheckout,
}));

import { useOrderCheckout } from '../useOrderCheckout';

function createCheckoutResult(): UseCheckoutResult {
  return {
    cartItems: [],
    total: 0,
    form: { name: '', phone: '', email: '', comment: '' },
    onChange: () => undefined,
    isSubmitting: false,
    submit: async () => ({ ok: true }),
  };
}

function createVerificationResult(
  overrides: Partial<StripeSessionVerificationApiResult> = {},
): StripeSessionVerificationApiResult {
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
    ...overrides,
  };
}

function setStripeReturn() {
  window.history.replaceState({}, '', '/order?payment=success&session_id=cs_test_123');
}

describe('useOrderCheckout', () => {
  beforeEach(() => {
    mocks.clearCart.mockReset();
    mocks.getStripeSessionVerification.mockReset();
    mocks.saveOrder.mockReset();
    mocks.useCartStore.mockReset();
    mocks.useCheckout.mockReset();

    mocks.useCartStore.mockReturnValue({
      clearCart: mocks.clearCart,
      saveOrder: mocks.saveOrder,
    });
    mocks.useCheckout.mockReturnValue(createCheckoutResult());
    setStripeReturn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/order');
  });

  it('persists a paid verification result without generating an id before the cart store', async () => {
    mocks.getStripeSessionVerification.mockResolvedValue(createVerificationResult());

    const { result } = renderHook(() => useOrderCheckout());

    await waitFor(() => expect(mocks.saveOrder).toHaveBeenCalledOnce());

    const savedOrder = mocks.saveOrder.mock.calls[0]?.[0] as SaveOrderInput;
    expect(savedOrder).toEqual({
      items: [{ id: 'li_123', name: 'Product model', quantity: 2, price: 600 }],
      total: 1200,
      name: 'Test buyer',
      phone: '+380501234567',
      email: 'buyer@example.com',
      comment: 'Call before delivery',
      createdAt: expect.any(String),
      paid: true,
      stripeSessionId: 'cs_test_123',
    });
    expect(savedOrder).not.toHaveProperty('id');
    expect(mocks.clearCart).toHaveBeenCalledOnce();
    expect(result.current.submittedOrder).toEqual(savedOrder);
    expect(window.location.pathname).toBe('/order');
  });

  it('does not persist or clear the cart for an unpaid verification result', async () => {
    mocks.getStripeSessionVerification.mockResolvedValue(createVerificationResult({ paid: false }));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

    const { result } = renderHook(() => useOrderCheckout());

    await waitFor(() => expect(alertSpy).toHaveBeenCalledOnce());

    expect(mocks.saveOrder).not.toHaveBeenCalled();
    expect(mocks.clearCart).not.toHaveBeenCalled();
    expect(result.current.submittedOrder).toBeNull();
  });

  it('does not persist a paid result after cleanup has cancelled the verification effect', async () => {
    let resolveVerification: (value: StripeSessionVerificationApiResult) => void;
    const verification = new Promise<StripeSessionVerificationApiResult>((resolve) => {
      resolveVerification = resolve;
    });
    mocks.getStripeSessionVerification.mockReturnValue(verification);

    const { unmount } = renderHook(() => useOrderCheckout());

    await waitFor(() => expect(mocks.getStripeSessionVerification).toHaveBeenCalledOnce());
    unmount();

    await act(async () => {
      resolveVerification!(createVerificationResult());
      await verification;
    });

    expect(mocks.saveOrder).not.toHaveBeenCalled();
    expect(mocks.clearCart).not.toHaveBeenCalled();
  });
});
