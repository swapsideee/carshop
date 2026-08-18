import 'server-only';

import type { ResultSetHeader } from 'mysql2/promise';

import { getDB } from './mysql';

const STALE_PROCESSING_MINUTES = 15;

export async function claimStripeWebhookEvent(stripeEventId: string): Promise<boolean> {
  const db = await getDB();

  const [insertResult] = await db.execute<ResultSetHeader>(
    `
      INSERT IGNORE INTO stripe_webhook_events (stripe_event_id, status, created_at, updated_at)
      VALUES (?, 'processing', NOW(), NOW())
    `,
    [stripeEventId],
  );

  if (insertResult.affectedRows === 1) {
    return true;
  }

  const [reclaimResult] = await db.execute<ResultSetHeader>(
    `
      UPDATE stripe_webhook_events
      SET updated_at = NOW()
      WHERE stripe_event_id = ?
        AND status = 'processing'
        AND updated_at < DATE_SUB(NOW(), INTERVAL ${STALE_PROCESSING_MINUTES} MINUTE)
    `,
    [stripeEventId],
  );

  return reclaimResult.affectedRows === 1;
}

export async function completeStripeWebhookEvent(stripeEventId: string): Promise<void> {
  const db = await getDB();
  await db.execute(
    `
      UPDATE stripe_webhook_events
      SET status = 'completed', completed_at = NOW(), updated_at = NOW()
      WHERE stripe_event_id = ?
    `,
    [stripeEventId],
  );
}

export async function releaseStripeWebhookEvent(stripeEventId: string): Promise<void> {
  const db = await getDB();
  await db.execute(
    `
      DELETE FROM stripe_webhook_events
      WHERE stripe_event_id = ? AND status = 'processing'
    `,
    [stripeEventId],
  );
}
