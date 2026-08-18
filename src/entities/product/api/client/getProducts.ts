import { fetchJson } from '@/shared/api';

import type { ProductListSortApiValue, ProductsPagedApiResult } from '../../model/apiTypes';

export type GetProductsParams = {
  page?: number;
  brand?: string;
  sort?: ProductListSortApiValue;
  q?: string;
  limit?: number;
  signal?: AbortSignal;
};

export async function getProducts({
  page,
  brand,
  sort,
  q,
  limit,
  signal,
}: GetProductsParams = {}): Promise<ProductsPagedApiResult> {
  const params = new URLSearchParams();

  if (page != null) params.set('page', String(page));
  if (brand) params.set('brand', String(brand));
  if (sort) params.set('sort', String(sort));
  if (q && String(q).trim()) params.set('q', String(q).trim());
  if (limit != null) params.set('limit', String(limit));

  const qs = params.toString();
  const url = qs ? `/api/products?${qs}` : '/api/products';

  return fetchJson<ProductsPagedApiResult>(url, { signal, cache: 'no-store' });
}
