export async function createStripeCheckout({ customer, cartItems }) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, cartItems }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok || !data?.url) {
    throw new Error(data?.message || 'Failed to create Stripe Checkout Session');
  }

  return data; // { ok: true, url }
}
