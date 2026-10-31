'use client';

import { useEffect, useState } from 'react';

import { getProductById } from '@/entities/product';

import type { ProductDetailApiDTO } from './apiTypes';

export function useProduct(productId: unknown): {
  product: ProductDetailApiDTO | null;
  loading: boolean;
} {
  const id = Number(productId);
  const isValidId = Number.isFinite(id) && id > 0;

  const [product, setProduct] = useState<ProductDetailApiDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isValidId) return;

    const controller = new AbortController();

    void (async () => {
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
  }, [id, isValidId]);

  return isValidId ? { product, loading } : { product: null, loading: false };
}
