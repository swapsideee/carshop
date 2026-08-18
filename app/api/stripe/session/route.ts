import { type NextRequest, NextResponse } from 'next/server';

import {
  CHECKOUT_SESSION_COOKIE,
  CHECKOUT_SESSION_METADATA_KEY,
  checkoutTokensMatch,
  parseCheckoutSessionVerification,
} from '@/features/order/checkout/lib/sessionVerification';
import { sessionToClientVerification } from '@/features/order/checkout/lib/stripeMappers';
import { getStripe } from '@/shared/api/server/stripeClient';
import { ErrorHandler, HttpError } from '@/shared/lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) throw new HttpError(400, 'Missing session_id');

  const verification = parseCheckoutSessionVerification(
    req.cookies.get(CHECKOUT_SESSION_COOKIE)?.value,
  );
  if (!verification || verification.sessionId !== sessionId) {
    throw new HttpError(403, 'Forbidden');
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  if (!checkoutTokensMatch(session.metadata?.[CHECKOUT_SESSION_METADATA_KEY], verification.token)) {
    throw new HttpError(403, 'Forbidden');
  }

  return NextResponse.json({ ok: true, ...sessionToClientVerification(session) });
};

export const GET = ErrorHandler(handler);
