'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { normalizeProductListSortApiValue, type ProductListSortApiValue } from '@/entities/product';

const catalogSearchParamKeys = ['page', 'brand', 'sort', 'q'] as const;

export type CatalogSearchParamUpdates = {
  page?: number | null;
  brand?: string | null;
  sort?: ProductListSortApiValue | null;
  q?: string | null;
};

export type CatalogUrlUpdateOptions = {
  scrollTop?: boolean;
};

export type UseCatalogSearchParamsResult = {
  page: number;
  selectedBrand: string;
  sort: ProductListSortApiValue;
  query: string;
  isPending: boolean;
  updateParams: (updates: CatalogSearchParamUpdates, options?: CatalogUrlUpdateOptions) => void;
  resetFilters: () => void;
};

export function useCatalogSearchParams(): UseCatalogSearchParamsResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const page = Math.max(Number(searchParams?.get('page')) || 1, 1);
  const selectedBrand = searchParams?.get('brand') || '';
  const rawSort = searchParams?.get('sort') ?? '';
  const sort = normalizeProductListSortApiValue(rawSort);
  const query = searchParams?.get('q') || '';

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateParams = (
    updates: CatalogSearchParamUpdates,
    { scrollTop = true }: CatalogUrlUpdateOptions = {},
  ): void => {
    const params = new URLSearchParams(searchParams?.toString());

    for (const key of catalogSearchParamKeys) {
      if (!Object.hasOwn(updates, key)) continue;

      const value = updates[key];

      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }

    if ('brand' in updates || 'sort' in updates || 'q' in updates) params.set('page', '1');

    const href = `/products?${params.toString()}`;

    startTransition(() => {
      router.push(href, { scroll: false });
    });

    if (scrollTop) requestAnimationFrame(scrollToTop);
  };

  const resetFilters = (): void => {
    startTransition(() => {
      router.push('/products?page=1', { scroll: false });
    });
    requestAnimationFrame(scrollToTop);
  };

  return { page, selectedBrand, sort, query, isPending, updateParams, resetFilters };
}
