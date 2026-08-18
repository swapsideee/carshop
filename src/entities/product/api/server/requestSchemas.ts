import { z } from 'zod';

import { parseRequestSchema } from '@/shared/lib';

import type { ProductSortBy, SortOrder } from '../../model/types';

const MAX_DATABASE_ID = 2_147_483_647;
const MAX_PAGE = 10_000;

const productQuerySchema = z.object({
  forSelect: z.enum(['0', '1']).optional().default('0'),
  brand: z.string().trim().max(255).optional().default(''),
  q: z.string().trim().max(255).optional().default(''),
  page: z.coerce.number().int().min(1).max(MAX_PAGE).optional().default(1),
  limit: z.coerce.number().int().min(1).max(60).optional().default(24),
  sort: z.enum(['', 'asc', 'desc']).optional().default(''),
  sortBy: z.enum(['price_pair', 'model']).optional().default('price_pair'),
});

const productIdSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .pipe(z.number().int().min(1).max(MAX_DATABASE_ID));

export type ProductsRequest =
  | {
      kind: 'select';
      brand: string;
      q: string;
    }
  | {
      kind: 'paged';
      brand: string;
      q: string;
      page: number;
      limit: number;
      sortBy: ProductSortBy;
      sortOrder: SortOrder;
    };

function toProductQuerySource(searchParams: URLSearchParams) {
  return {
    forSelect: searchParams.get('forSelect') ?? undefined,
    brand: searchParams.get('brand') ?? undefined,
    q: searchParams.get('q') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    sortBy: searchParams.get('sort_by') ?? undefined,
  };
}

export function parseProductsRequest(searchParams: URLSearchParams): ProductsRequest {
  const query = parseRequestSchema(
    productQuerySchema,
    toProductQuerySource(searchParams),
    'Invalid products query',
  );

  if (query.forSelect === '1') {
    return { kind: 'select', brand: query.brand, q: query.q };
  }

  return {
    kind: 'paged',
    brand: query.brand,
    q: query.q,
    page: query.page,
    limit: query.limit,
    sortBy: query.sortBy,
    sortOrder: query.sort === 'desc' ? 'DESC' : 'ASC',
  };
}

export function parseProductId(id: string): number {
  return parseRequestSchema(productIdSchema, id, 'Invalid product id');
}
