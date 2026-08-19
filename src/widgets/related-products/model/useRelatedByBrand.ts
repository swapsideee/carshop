'use client';

import { useEffect, useState } from 'react';

import {
  getBrandSlug,
  getProductsByBrand,
  type ProductDetailApiDTO,
  type ProductListItemApiDTO,
} from '@/entities/product';

export type UseRelatedByBrandResult = {
  items: ProductListItemApiDTO[];
  loading: boolean;
};

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
  );
}

export function useRelatedByBrand(
  product: ProductDetailApiDTO | null | undefined,
): UseRelatedByBrandResult {
  const [items, setItems] = useState<ProductListItemApiDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const brand = getBrandSlug(product);
    const productId = product?.id;

    if (!brand) {
      setItems([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        setLoading(true);
        const data = await getProductsByBrand({ brand, signal: controller.signal });
        const list: ProductListItemApiDTO[] = Array.isArray(data?.items) ? data.items : [];
        setItems(list.filter((item) => item.id !== productId));
      } catch (error: unknown) {
        if (isAbortError(error)) return;
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [product]);

  return { items, loading };
}
