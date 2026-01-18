import { fetchJson } from '@/shared/api/fetchJson';

export async function getProductById({ id, signal } = {}) {
  if (id == null) throw new Error('getProductById: id is required');
  return fetchJson(`/api/products/${id}`, { signal });
}
