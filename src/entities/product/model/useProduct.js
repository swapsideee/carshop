'use client';

import { useEffect, useState } from 'react';

import { getProductById } from '@/entities/product';

export function useProduct(productId) {
  const id = Number(productId);

  const [product, setProduct] = useState(null);
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
      } catch (e) {
        if (e?.name === 'AbortError') return;
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  return { product, loading };
}
