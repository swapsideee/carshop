import { fetchJson } from '@/shared/api';

import type { Brand } from '../../model/types';

export type GetBrandsParams = {
  signal?: AbortSignal;
};

export async function getBrands({ signal }: GetBrandsParams = {}): Promise<Brand[]> {
  return fetchJson<Brand[]>('/api/brands', { signal });
}
