import 'server-only';

import Stripe from 'stripe';

const stripeClients = new Map<string, Stripe>();

export function getStripe(secretKey: string): Stripe {
  const existingClient = stripeClients.get(secretKey);
  if (existingClient) return existingClient;

  const stripeClient = new Stripe(secretKey);
  stripeClients.set(secretKey, stripeClient);

  return stripeClient;
}
