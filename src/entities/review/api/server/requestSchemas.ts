import { z } from 'zod';

import { parseRequestSchema } from '@/shared/lib';

import type { CreateReviewInput } from '../../model/types';

const MAX_DATABASE_ID = 2_147_483_647;
const MAX_PAGE = 10_000;

const reviewBodySchema = z
  .object({
    productId: z.coerce.number().int().min(1).max(MAX_DATABASE_ID),
    rating: z.coerce.number().int().min(1).max(5),
    authorName: z
      .string()
      .trim()
      .max(60)
      .nullish()
      .transform((value) => value || null),
    comment: z.string().trim().min(1).max(1000),
  })
  .strict();

const reviewsQuerySchema = z.object({
  productId: z.coerce.number().int().min(1).max(MAX_DATABASE_ID).optional(),
  page: z.coerce.number().int().min(1).max(MAX_PAGE).optional().default(1),
  limit: z.coerce.number().int().min(5).max(50).optional().default(10),
});

export type ReviewsRequest =
  | {
      kind: 'feed';
      page: number;
      limit: number;
    }
  | {
      kind: 'byProduct';
      productId: number;
      page: number;
      limit: number;
    };

function toReviewsQuerySource(searchParams: URLSearchParams) {
  return {
    productId: searchParams.get('productId') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  };
}

export function parseCreateReviewInput(source: unknown): CreateReviewInput {
  return parseRequestSchema(reviewBodySchema, source, 'Invalid review input');
}

export function parseReviewsRequest(searchParams: URLSearchParams): ReviewsRequest {
  const query = parseRequestSchema(
    reviewsQuerySchema,
    toReviewsQuerySource(searchParams),
    'Invalid reviews query',
  );

  if (query.productId === undefined) {
    return { kind: 'feed', page: query.page, limit: query.limit };
  }

  return {
    kind: 'byProduct',
    productId: query.productId,
    page: query.page,
    limit: query.limit,
  };
}
