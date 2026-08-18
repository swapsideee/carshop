import type {
  ReviewApiDTO,
  ReviewFeedItemApiDTO,
  ReviewsByProductApiResult,
  ReviewsPageApiResult,
} from '../../model/apiTypes';
import type {
  ReviewDTO,
  ReviewFeedItemDTO,
  ReviewsByProductResultDTO,
  ReviewsPageResultDTO,
} from '../../model/types';

function toReviewApiDTO(review: ReviewDTO): ReviewApiDTO {
  return {
    id: review.id,
    product_id: review.productId,
    rating: review.rating,
    author_name: review.authorName,
    comment: review.comment,
    created_at: review.createdAt,
  };
}

function toReviewFeedItemApiDTO(review: ReviewFeedItemDTO): ReviewFeedItemApiDTO {
  return {
    id: review.id,
    rating: review.rating,
    author_name: review.authorName,
    comment: review.comment,
    created_at: review.createdAt,
    model: review.productModel,
    name: review.productName,
  };
}

export function toReviewsByProductApiResult(
  result: ReviewsByProductResultDTO,
): ReviewsByProductApiResult {
  return {
    items: result.items.map(toReviewApiDTO),
    total: result.total,
    totalPages: result.totalPages,
    page: result.page,
    limit: result.limit,
    avgRating: result.avgRating,
  };
}

export function toReviewsFeedApiResult(
  result: ReviewsPageResultDTO<ReviewFeedItemDTO>,
): ReviewsPageApiResult<ReviewFeedItemApiDTO> {
  return {
    items: result.items.map(toReviewFeedItemApiDTO),
    total: result.total,
    totalPages: result.totalPages,
    page: result.page,
    limit: result.limit,
  };
}
