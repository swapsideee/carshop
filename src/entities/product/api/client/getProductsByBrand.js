import { fetchJson } from '@/shared/api';

export async function getProductsByBrand({ brand, page, limit, sort, q, signal } = {}) {
  const params = new URLSearchParams();

  if (brand) params.set('brand', String(brand));
  if (page != null) params.set('page', String(page));
  if (limit != null) params.set('limit', String(limit));
  if (sort) params.set('sort', String(sort));
  if (q) params.set('q', String(q));

  const qs = params.toString();
  const url = qs ? `/api/products?${qs}` : '/api/products';

  return fetchJson(url, { signal });
}
