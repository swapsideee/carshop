import { NextResponse } from 'next/server';

import { sessionToEmailPayload } from '@/features/order/checkout/lib/stripeMappers';
import { sendOrderEmail } from '@/shared/api/server';
import { stripe } from '@/shared/api/server/stripeClient';
import { ErrorHandler, HttpError } from '@/shared/lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const processedEventIds = globalThis.__stripeProcessedEventIds || new Set();
globalThis.__stripeProcessedEventIds = processedEventIds;

const handler = async (req) => {
  const sig = req.headers.get('stripe-signature');
  if (!sig) throw new HttpError(400, 'Missing stripe-signature header');

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new HttpError(400, `Bad signature: ${err?.message || ''}`.trim());
  }

  if (processedEventIds.has(event.id)) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, ignored: true, type: event.type });
  }

  processedEventIds.add(event.id);

  const s = event.data.object;

  const fullSession = await stripe.checkout.sessions.retrieve(s.id, {
    expand: ['line_items'],
  });

  if (fullSession.payment_status !== 'paid') {
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

  console.log('✅ PAID (stripe webhook):', {
    id: fullSession.id,
    email: emailPayload.email,
    amount_total: fullSession.amount_total,
    currency: fullSession.currency,
  });

  return NextResponse.json({ ok: true });
};

export const POST = ErrorHandler(handler);
