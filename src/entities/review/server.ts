/**
 * Entity: review — server-only public API (DB/queries).
 *
 * Use only in Route Handlers / Server Components.
 */

import 'server-only';

export type { ReviewsRequest } from './api/server';
export {
  createReview,
  getReviewsByProduct,
  getReviewsFeed,
  parseCreateReviewInput,
  parseReviewsRequest,
} from './api/server';
export { toReviewsByProductApiResult, toReviewsFeedApiResult } from './api/server';
export type {
  CreateReviewInput,
  ReviewDTO,
  ReviewFeedItemDTO,
  ReviewsByProductResultDTO,
  ReviewsPageResultDTO,
} from './model/types';
