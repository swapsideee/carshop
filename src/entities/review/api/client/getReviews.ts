import { fetchJson } from '@/shared/api';

import type { ReviewsByProductResult } from '../../model/types';

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
}: GetReviewsParams): Promise<ReviewsByProductResult> {
  const params = new URLSearchParams();
  params.set('productId', String(productId));
  params.set('page', String(page));
  params.set('limit', String(limit));

  return fetchJson<ReviewsByProductResult>(`/api/reviews?${params.toString()}`, { signal });
}
