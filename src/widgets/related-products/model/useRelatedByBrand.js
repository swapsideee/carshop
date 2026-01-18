'use client';

import { useEffect, useState } from 'react';

import { getProductsByBrand } from '@/entities/product/api/getProductsByBrand';
import { getBrandSlug } from '@/entities/product/model/selectors';

export function useRelatedByBrand(product) {
  const [items, setItems] = useState([]);
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

    (async () => {
      try {
        setLoading(true);
        const data = await getProductsByBrand({ brand, signal: controller.signal });
        const list = Array.isArray(data?.items) ? data.items : [];
        setItems(list.filter((x) => x?.id !== productId));
      } catch (e) {
        if (e?.name === 'AbortError') return;
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [
    product?.id,
    product.brand_slug,
    product.brand,
    product.brandName,
    product.brand_name,
    product,
  ]);

  return { items, loading };
}
