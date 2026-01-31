import type { Review } from './types';

export function clampRating(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

export function avgRating(items: Array<Pick<Review, 'rating'>> | null | undefined): number {
  if (!Array.isArray(items) || items.length === 0) return 0;
  const sum = items.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return clampRating(sum / items.length);
}
