'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { isProductSlug } from '@/entities/product';

export function useProductRoute() {
  const params = useParams();
  const slug = params?.slug;

  return useMemo(() => {
    if (!slug) return { kind: 'empty' };

    const isProduct = isProductSlug(slug);

    if (isProduct) {
      const id = Number(slug);
      if (!Number.isFinite(id) || id <= 0) return { kind: 'empty' };
      return { kind: 'product', id };
    }

    return { kind: 'brand', brand: String(slug) };
  }, [slug]);
}
