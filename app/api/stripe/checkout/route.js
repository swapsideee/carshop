import { NextResponse } from 'next/server';

import { cartItemsToLineItems } from '@/features/order/checkout/lib/stripeMappers';
import { getAppUrl,stripe } from '@/shared/api/server/stripeClient';
import { ErrorHandler, HttpError } from '@/shared/lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function validateCheckoutBody(body) {
  const customer = body?.customer;
  const cartItems = body?.cartItems;

  if (!customer?.name || !customer?.phone || !customer?.email) {
    throw new HttpError(400, 'Некоректні дані клієнта');
  }

  return { customer, cartItems };
}

const handler = async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) throw new HttpError(400, 'Invalid JSON');

  const { customer, cartItems } = validateCheckoutBody(body);

  const line_items = cartItemsToLineItems(cartItems, 'uah');
  const APP_URL = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',

    payment_method_types: ['card'],

    line_items,

    success_url: `${APP_URL}/order?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/order?payment=cancel`,

    customer_email: customer.email,

    metadata: {
      name: customer.name,
      phone: customer.phone,
      comment: customer.comment || '',
    },
  });

  return NextResponse.json({ ok: true, url: session.url });
};

export const POST = ErrorHandler(handler);
