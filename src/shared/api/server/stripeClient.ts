import 'server-only';

import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY env var');
}

export const stripe = new Stripe(secretKey);

export function getAppUrl(): string {
  return process.env.APP_URL || 'http://localhost:3000';
}
