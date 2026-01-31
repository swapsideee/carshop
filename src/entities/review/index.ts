/**
 * Entity: review — client-safe public API.
 *
 * Import from here in UI/widgets/features:
 *   import { getReviews, avgRating } from '@/entities/review';
 *
 * Server-only API lives in `./server.ts`.
 */

export * from './api/client';
export { avgRating, clampRating } from './model/selectors';
export type {
  CreateReviewInput,
  Review,
  ReviewFeedItem,
  ReviewsByProductResult,
  ReviewsPageResult,
} from './model/types';
