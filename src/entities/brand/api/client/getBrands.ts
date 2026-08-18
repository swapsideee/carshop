import { fetchJson } from '@/shared/api';

import type { BrandApiDTO } from '../../model/apiTypes';

export type GetBrandsParams = {
  signal?: AbortSignal;
};

export async function getBrands({ signal }: GetBrandsParams = {}): Promise<BrandApiDTO[]> {
  return fetchJson<BrandApiDTO[]>('/api/brands', { signal });
}
