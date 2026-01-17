import { fetchJson } from '@/shared/api/fetchJson';

export async function getBrands({ signal } = {}) {
  return fetchJson('/api/brands', { signal });
}
