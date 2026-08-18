import { type NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { sessionToEmailPayload } from '@/features/order/checkout/lib/stripeMappers';
import { sendOrderEmail } from '@/shared/api/server';
import { getStripe } from '@/shared/api/server/stripeClient';
import { getStripeWebhookEnv } from '@/shared/config/env';
import {
  claimStripeWebhookEvent,
  completeStripeWebhookEvent,
  releaseStripeWebhookEvent,
} from '@/shared/db';
import { ErrorHandler, HttpError } from '@/shared/lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handledEventTypes = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
]);

const handler = async (req: NextRequest) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) throw new HttpError(400, 'Missing stripe-signature header');

  const { secretKey, webhookSecret } = getStripeWebhookEnv();

  const rawBody = await req.text();
  const stripe = getStripe(secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    throw new HttpError(400, 'Invalid Stripe signature');
  }

  if (!handledEventTypes.has(event.type)) {
    return NextResponse.json({ ok: true, ignored: true, type: event.type });
  }

  const claimed = await claimStripeWebhookEvent(event.id);
  if (!claimed) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  try {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const fullSession = await stripe.checkout.sessions.retrieve(checkoutSession.id, {
      expand: ['line_items'],
    });

    if (fullSession.payment_status !== 'paid') {
      await releaseStripeWebhookEvent(event.id);
      return NextResponse.json({ ok: true, skipped: true, reason: 'not_paid' });
    }

    const emailPayload = sessionToEmailPayload(fullSession);
    await sendOrderEmail({
      name: emailPayload.name,
      phone: emailPayload.phone,
      email: emailPayload.email,
      comment: emailPayload.comment,
      cartItems: emailPayload.cartItems,
      total: emailPayload.total,
    });

    await completeStripeWebhookEvent(event.id);

    console.log('Paid Stripe checkout processed', {
      sessionId: fullSession.id,
      amountTotal: fullSession.amount_total,
      currency: fullSession.currency,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    try {
      await releaseStripeWebhookEvent(event.id);
    } catch (cleanupError) {
      console.error('Failed to release Stripe webhook event claim', cleanupError);
    }

    throw error;
  }
};

export const POST = ErrorHandler(handler);
