/**
 * Entity: review — server-only public API (DB/queries).
 *
 * Use only in Route Handlers / Server Components.
 */

import 'server-only';

export { createReview, getReviewsByProduct, getReviewsFeed } from './api/server';
export type { CreateReviewInput,Review, ReviewFeedItem, ReviewsByProductResult, ReviewsPageResult } from './model/types';
