import type { CheckoutCartItem, CheckoutCustomer } from '../lib/schemas';

type CheckoutSessionResponse = {
  ok: true;
  url: string;
};

type CreateStripeCheckoutArgs = {
  customer: CheckoutCustomer;
  cartItems: CheckoutCartItem[];
};

function isCheckoutSessionResponse(data: unknown): data is CheckoutSessionResponse {
  if (typeof data !== 'object' || data === null) return false;

  const response = data as { ok?: unknown; url?: unknown };
  return response.ok === true && typeof response.url === 'string';
}

export async function createStripeCheckout({
  customer,
  cartItems,
}: CreateStripeCheckoutArgs): Promise<CheckoutSessionResponse> {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, cartItems }),
  });

  const data: unknown = await res.json().catch(() => null);
  if (!res.ok || !isCheckoutSessionResponse(data)) {
    throw new Error('Failed to create Stripe Checkout Session');
  }

  return data;
}
