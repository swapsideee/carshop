import type { ReviewRow } from '@/shared/db/schema';

import type { ReviewDTO, ReviewFeedItemDTO } from '../../model/types';

export type ReviewFeedRow = Pick<
  ReviewRow,
  'author_name' | 'comment' | 'created_at' | 'id' | 'rating'
> & {
  model: string | null;
  name: string | null;
};

function serializeDate(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}

export function mapReviewRow(row: ReviewRow): ReviewDTO {
  return {
    id: Number(row.id),
    productId: Number(row.product_id),
    rating: Number(row.rating),
    authorName: row.author_name,
    comment: row.comment,
    createdAt: serializeDate(row.created_at),
  };
}

export function mapReviewFeedRow(row: ReviewFeedRow): ReviewFeedItemDTO {
  return {
    id: Number(row.id),
    rating: Number(row.rating),
    authorName: row.author_name,
    comment: row.comment,
    createdAt: serializeDate(row.created_at),
    productModel: row.model,
    productName: row.name,
  };
}
