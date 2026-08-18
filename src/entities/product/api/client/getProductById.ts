import { fetchJson } from '@/shared/api';

import type { ProductDetailApiDTO } from '../../model/apiTypes';

export type GetProductByIdParams = {
  id: number;
  signal?: AbortSignal;
};

export async function getProductById({
  id,
  signal,
}: GetProductByIdParams): Promise<ProductDetailApiDTO | null> {
  if (id == null) throw new Error('getProductById: id is required');
  return fetchJson<ProductDetailApiDTO | null>(`/api/products/${id}`, { signal });
}
