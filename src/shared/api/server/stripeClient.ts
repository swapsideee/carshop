import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export function getAppUrl() {
  return process.env.APP_URL || 'http://localhost:3000';
}
