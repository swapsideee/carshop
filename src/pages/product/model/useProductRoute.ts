'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { isProductSlug } from '@/entities/product';

type ProductRouteParams = {
  slug?: string;
};

export type ProductRoute =
  | {
      kind: 'empty';
    }
  | {
      kind: 'product';
      id: number;
    }
  | {
      kind: 'brand';
      brand: string;
    };

export function parseProductRoute(slug?: string): ProductRoute {
  if (!slug) return { kind: 'empty' };

  if (isProductSlug(slug)) {
    const id = Number(slug);

    if (!Number.isFinite(id) || id <= 0) return { kind: 'empty' };

    return { kind: 'product', id };
  }

  return { kind: 'brand', brand: slug };
}

export function useProductRoute(): ProductRoute {
  const params = useParams<ProductRouteParams>();
  const slug = params?.slug;

  return useMemo(() => parseProductRoute(slug), [slug]);
}
