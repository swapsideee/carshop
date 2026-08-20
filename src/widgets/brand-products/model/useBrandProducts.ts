import { useEffect, useState } from 'react';

import { getProductsByBrand, type ProductListItemApiDTO } from '@/entities/product';

export type UseBrandProductsResult = {
  items: ProductListItemApiDTO[];
  loading: boolean;
};

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
  );
}

export function useBrandProducts(brand: string | null | undefined): UseBrandProductsResult {
  const normalizedBrand = String(brand || '');

  const [items, setItems] = useState<ProductListItemApiDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!normalizedBrand) {
      setItems([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        setLoading(true);
        const data = await getProductsByBrand({
          brand: normalizedBrand,
          signal: controller.signal,
        });
        const next: ProductListItemApiDTO[] = Array.isArray(data?.items) ? data.items : [];
        setItems(next);
      } catch (error: unknown) {
        if (isAbortError(error)) return;
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [normalizedBrand]);

  return { items, loading };
}
