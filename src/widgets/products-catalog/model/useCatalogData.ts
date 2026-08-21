'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { type BrandApiDTO, getBrands } from '@/entities/brand';
import {
  getProducts,
  type ProductListItemApiDTO,
  type ProductListSortApiValue,
} from '@/entities/product';

export type UseCatalogDataResult = {
  items: ProductListItemApiDTO[];
  brands: BrandApiDTO[];
  totalPages: number;
  total: number;
  isLoadingMore: boolean;
  isBootSkeleton: boolean;
  isEmpty: boolean;
  loadedTo: number;
  onLoadMore: () => Promise<void>;
  canLoadMore: boolean;
};

type UseCatalogDataParams = {
  page: number;
  selectedBrand: string;
  sort: ProductListSortApiValue;
  query: string;
};

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
  );
}

export function useCatalogData({
  page,
  selectedBrand,
  sort,
  query,
}: UseCatalogDataParams): UseCatalogDataResult {
  const [items, setItems] = useState<ProductListItemApiDTO[]>([]);
  const [brands, setBrands] = useState<BrandApiDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const bootFetchedRef = useRef(false);
  const [loadedTo, setLoadedTo] = useState(page);

  const filtersKey = useMemo(() => {
    const brand = selectedBrand || '';
    const selectedSort = sort || '';
    const trimmedQuery = (query || '').trim();
    return `${brand}__${selectedSort}__${trimmedQuery}`;
  }, [selectedBrand, sort, query]);

  useEffect(() => {
    if (brands.length) return;

    const controller = new AbortController();

    getBrands({ signal: controller.signal })
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {});

    return () => controller.abort();
  }, [brands.length]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadedTo(page);

    getProducts({
      page,
      brand: selectedBrand || undefined,
      sort: sort || undefined,
      q: query || undefined,
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;

        const nextItems = Array.isArray(data.items) ? data.items : [];
        setItems(nextItems);
        setTotalPages(Number(data.totalPages) || 1);
        setTotal(Number(data.total) || 0);

        bootFetchedRef.current = true;
        setIsLoadingMore(false);
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return;

        setItems([]);
        setTotalPages(1);
        setTotal(0);

        bootFetchedRef.current = true;
        setIsLoadingMore(false);
      });

    return () => controller.abort();
  }, [page, filtersKey, selectedBrand, sort, query]);

  const isBootSkeleton = !bootFetchedRef.current && items.length === 0;
  const isEmpty = !isBootSkeleton && items.length === 0;
  const canLoadMore = !isBootSkeleton && !isLoadingMore && loadedTo < totalPages;

  const onLoadMore = async (): Promise<void> => {
    if (!canLoadMore) return;

    const nextPage = loadedTo + 1;
    setIsLoadingMore(true);

    try {
      const data = await getProducts({
        page: nextPage,
        brand: selectedBrand || undefined,
        sort: sort || undefined,
        q: query || undefined,
      });
      const chunk = Array.isArray(data.items) ? data.items : [];

      setLoadedTo(nextPage);
      setTotalPages(Number(data.totalPages) || totalPages);
      setTotal(Number(data.total) || total);

      setItems((previousItems) => {
        const merged = [...previousItems, ...chunk];
        const seen = new Set<number | string>();
        const uniqueItems: ProductListItemApiDTO[] = [];

        for (const item of merged) {
          const key = item.id ?? `${item.slug ?? ''}_${item.model ?? ''}`;

          if (seen.has(key)) continue;

          seen.add(key);
          uniqueItems.push(item);
        }

        return uniqueItems;
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    items,
    brands,
    totalPages,
    total,
    isLoadingMore,
    isBootSkeleton,
    isEmpty,
    loadedTo,
    onLoadMore,
    canLoadMore,
  };
}
