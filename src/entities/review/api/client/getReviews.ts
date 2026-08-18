import { fetchJson } from '@/shared/api';

import type { ReviewsByProductApiResult } from '../../model/apiTypes';

export const REVIEWS_LIMIT_DEFAULT = 10;

export type GetReviewsParams = {
  productId: number;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
};

export async function getReviews({
  productId,
  page = 1,
  limit = REVIEWS_LIMIT_DEFAULT,
  signal,
}: GetReviewsParams): Promise<ReviewsByProductApiResult> {
  const params = new URLSearchParams();
  params.set('productId', String(productId));
  params.set('page', String(page));
  params.set('limit', String(limit));

  return fetchJson<ReviewsByProductApiResult>(`/api/reviews?${params.toString()}`, { signal });
}
