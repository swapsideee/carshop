import { NextResponse } from 'next/server';

import { sessionToClientVerification } from '@/features/order/checkout/lib/stripeMappers';
import { stripe } from '@/shared/api/server/stripeClient';
import { ErrorHandler, HttpError } from '@/shared/lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (req) => {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) throw new HttpError(400, 'Missing session_id');

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  return NextResponse.json({ ok: true, ...sessionToClientVerification(session) });
};

export const GET = ErrorHandler(handler);
