import { type NextRequest, NextResponse } from 'next/server';

import { getProductsForCheckout } from '@/entities/product/server';
import {
  getUniqueCheckoutProductIds,
  parseCheckoutRequest,
} from '@/features/order/checkout/lib/schemas';
import { cartItemsToLineItems } from '@/features/order/checkout/lib/stripeMappers';
import { getAppUrl, stripe } from '@/shared/api/server/stripeClient';
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

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',

    payment_method_types: ['card'],

    line_items: cartItemsToLineItems(cartItems, products),

    success_url: `${getAppUrl()}/order?payment=success&session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${getAppUrl()}/order?payment=cancel`,

    customer_email: customer.email,

    metadata: {
      name: customer.name,

      phone: customer.phone,

      comment: customer.comment,
    },
  });

  if (!session.url) {
    throw new HttpError(502, 'Не вдалося створити платіжну сесію');
  }

  return NextResponse.json({ ok: true, url: session.url });
};

export const POST = ErrorHandler(handler);
