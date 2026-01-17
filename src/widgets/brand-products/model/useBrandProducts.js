'use client';

import { useEffect, useState } from 'react';

import { getProductsByBrand } from '@/entities/product/api/getProductsByBrand';

export function useBrandProducts(brand) {
  const b = String(brand || '');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!b) {
      setItems([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const data = await getProductsByBrand({ brand: b, signal: controller.signal });
        const next = Array.isArray(data?.items) ? data.items : [];
        setItems(next);
      } catch (e) {
        if (e?.name === 'AbortError') return;
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [b]);

  return { items, loading };
}
