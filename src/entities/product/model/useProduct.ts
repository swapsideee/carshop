'use client';

import { useEffect, useState } from 'react';

import { getProductById } from '@/entities/product';

import type { Product } from './types';

export function useProduct(productId: unknown): { product: Product | null; loading: boolean } {
  const id = Number(productId);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const data = await getProductById({ id, signal: controller.signal });
        setProduct(data ?? null);
      } catch (e: unknown) {
        if (
          e &&
          typeof e === 'object' &&
          'name' in e &&
          (e as { name?: string }).name === 'AbortError'
        )
          return;
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  return { product, loading };
}
