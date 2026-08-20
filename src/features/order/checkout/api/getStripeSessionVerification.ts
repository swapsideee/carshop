import {
  isStripeSessionVerificationApiResult,
  type StripeSessionVerificationApiResult,
} from '../model/apiTypes';

function getErrorMessage(data: unknown): string | null {
  if (typeof data !== 'object' || data === null || !('message' in data)) return null;

  return typeof data.message === 'string' ? data.message : null;
}

export async function getStripeSessionVerification(
  sessionId: string,
): Promise<StripeSessionVerificationApiResult> {
  const response = await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`);
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok || !isStripeSessionVerificationApiResult(data)) {
    throw new Error(getErrorMessage(data) || 'Failed to verify payment');
  }

  return data;
}
