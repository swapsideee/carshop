import { fetchJson } from '@/shared/api';

import type { ProductSelectApiResult } from '../../model/apiTypes';

export async function getProductsForSelect(): Promise<ProductSelectApiResult> {
  return fetchJson<ProductSelectApiResult>('/api/products?forSelect=1', { cache: 'no-store' });
}
