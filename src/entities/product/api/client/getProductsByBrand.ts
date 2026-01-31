import { fetchJson } from '@/shared/api';

import type { ProductSortBy, ProductsPagedResult, SortOrder } from '../../model/types';

export type GetProductsByBrandParams = {
  brand?: string;
  page?: number;
  limit?: number;
  sort?: ProductSortBy | `${ProductSortBy}:${SortOrder}` | string;
  q?: string;
  signal?: AbortSignal;
};

export async function getProductsByBrand({
  brand,
  page,
  limit,
  sort,
  q,
  signal,
}: GetProductsByBrandParams = {}): Promise<ProductsPagedResult> {
  const params = new URLSearchParams();

  if (brand) params.set('brand', String(brand));
  if (page != null) params.set('page', String(page));
  if (limit != null) params.set('limit', String(limit));
  if (sort) params.set('sort', String(sort));
  if (q) params.set('q', String(q));

  const qs = params.toString();
  const url = qs ? `/api/products?${qs}` : '/api/products';

  return fetchJson<ProductsPagedResult>(url, { signal });
}
