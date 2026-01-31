import { fetchJson } from '@/shared/api';

import type { Product } from '../../model/types';

export type GetProductByIdParams = {
  id: number;
  signal?: AbortSignal;
};

export async function getProductById({
  id,
  signal,
}: GetProductByIdParams): Promise<Product | null> {
  if (id == null) throw new Error('getProductById: id is required');
  return fetchJson<Product | null>(`/api/products/${id}`, { signal });
}
