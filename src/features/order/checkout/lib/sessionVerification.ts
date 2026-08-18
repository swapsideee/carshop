import 'server-only';

import { randomUUID, timingSafeEqual } from 'node:crypto';

export const CHECKOUT_SESSION_COOKIE = 'carshop_checkout_session';
export const CHECKOUT_SESSION_METADATA_KEY = 'checkout_verification_token';

type CheckoutSessionVerification = {
  sessionId: string;
  token: string;
};

export function createCheckoutSessionVerification(): CheckoutSessionVerification {
  return { sessionId: '', token: randomUUID() };
}

export function serializeCheckoutSessionVerification(
  verification: CheckoutSessionVerification,
): string {
  return Buffer.from(JSON.stringify(verification)).toString('base64url');
}

export function parseCheckoutSessionVerification(
  value: string | undefined,
): CheckoutSessionVerification | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const verification = parsed as { sessionId?: unknown; token?: unknown };
    if (typeof verification.sessionId !== 'string' || typeof verification.token !== 'string') {
      return null;
    }

    return { sessionId: verification.sessionId, token: verification.token };
  } catch {
    return null;
  }
}

export function checkoutTokensMatch(expected: string | undefined, actual: string): boolean {
  if (!expected) return false;

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  return (
    expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer)
  );
}
