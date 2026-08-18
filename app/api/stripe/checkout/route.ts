import { type NextRequest, NextResponse } from 'next/server';

import { getProductsForCheckout } from '@/entities/product/server';
import {
  getUniqueCheckoutProductIds,
  parseCheckoutRequest,
} from '@/features/order/checkout/lib/schemas';
import {
  CHECKOUT_SESSION_COOKIE,
  CHECKOUT_SESSION_METADATA_KEY,
  createCheckoutSessionVerification,
  serializeCheckoutSessionVerification,
} from '@/features/order/checkout/lib/sessionVerification';
import { cartItemsToLineItems } from '@/features/order/checkout/lib/stripeMappers';
import { getStripe } from '@/shared/api/server/stripeClient';
import { getStripeCheckoutEnv } from '@/shared/config/env';
import { ErrorHandler, HttpError } from '@/shared/lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (req: NextRequest) => {
  const body: unknown = await req.json().catch(() => null);
  if (!body) throw new HttpError(400, 'Invalid JSON');

  const { customer, cartItems } = parseCheckoutRequest(body);
  const productIds = getUniqueCheckoutProductIds(cartItems);
  const products = await getProductsForCheckout(productIds);

  if (products.length !== productIds.length) {
    throw new HttpError(400, 'Один або кілька товарів більше недоступні');
  }

  const checkoutEnv = getStripeCheckoutEnv();
  const verification = createCheckoutSessionVerification();
  const stripe = getStripe(checkoutEnv.secretKey);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: cartItemsToLineItems(cartItems, products),
    success_url: `${checkoutEnv.appUrl}/order?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${checkoutEnv.appUrl}/order?payment=cancel`,
    customer_email: customer.email,
    metadata: {
      name: customer.name,
      phone: customer.phone,
      comment: customer.comment,
      [CHECKOUT_SESSION_METADATA_KEY]: verification.token,
    },
  });

  if (!session.url) {
    throw new HttpError(502, 'Не вдалося створити платіжну сесію');
  }

  const response = NextResponse.json({ ok: true, url: session.url });
  response.cookies.set({
    name: CHECKOUT_SESSION_COOKIE,
    value: serializeCheckoutSessionVerification({ ...verification, sessionId: session.id }),
    httpOnly: true,
    sameSite: 'lax',
    secure: checkoutEnv.isProduction,
    maxAge: 60 * 60,
    path: '/api/stripe/session',
  });

  return response;
};

export const POST = ErrorHandler(handler);
