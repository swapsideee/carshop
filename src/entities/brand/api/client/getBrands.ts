import { fetchJson } from '@/shared/api';

import type { BrandDTO } from '../../model/types';

export type GetBrandsParams = {
  signal?: AbortSignal;
};

export async function getBrands({ signal }: GetBrandsParams = {}): Promise<BrandDTO[]> {
  return fetchJson<BrandDTO[]>('/api/brands', { signal });
}
