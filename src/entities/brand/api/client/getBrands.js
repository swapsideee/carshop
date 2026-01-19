import { fetchJson } from '@/shared/api';

export async function getBrands({ signal } = {}) {
  return fetchJson('/api/brands', { signal });
}
