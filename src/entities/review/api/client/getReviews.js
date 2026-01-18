import { fetchJson } from '@/shared/api/fetchJson';

export const REVIEWS_LIMIT_DEFAULT = 10;

export async function getReviews({ productId, page = 1, limit = REVIEWS_LIMIT_DEFAULT, signal }) {
  const params = new URLSearchParams();
  params.set('productId', String(productId));
  params.set('page', String(page));
  params.set('limit', String(limit));

  return fetchJson(`/api/reviews?${params.toString()}`, { signal });
}
