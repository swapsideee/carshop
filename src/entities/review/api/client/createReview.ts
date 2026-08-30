import type { CreateReviewApiInput } from '../../model/apiTypes';

export async function createReview(requestBody: CreateReviewApiInput): Promise<void> {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`POST /api/reviews failed: ${response.status}`);
  }
}
