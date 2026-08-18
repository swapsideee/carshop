'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import { type BrandApiDTO, getBrands } from '@/entities/brand';
import {
  getProducts,
  normalizeProductListSortApiValue,
  type ProductListItemApiDTO,
  type ProductListSortApiValue,
} from '@/entities/product';

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

export type UseProductsCatalogResult = {
  page: number;
  selectedBrand: string;
  sort: ProductListSortApiValue;
  query: string;
  items: ProductListItemApiDTO[];
  brands: BrandApiDTO[];
  totalPages: number;
  total: number;
  showMobileFilters: boolean;
  setShowMobileFilters: Dispatch<SetStateAction<boolean>>;
  isPending: boolean;
  isLoadingMore: boolean;
  isBootSkeleton: boolean;
  isEmpty: boolean;
  loadedTo: number;
  updateParams: (updates: CatalogSearchParamUpdates, options?: CatalogUrlUpdateOptions) => void;
  resetFilters: () => void;
  onLoadMore: () => Promise<void>;
  canLoadMore: boolean;
};

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
  );
}

export function useProductsCatalog(): UseProductsCatalogResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams?.get('page')) || 1, 1);
  const selectedBrand = searchParams?.get('brand') || '';
  const rawSort = searchParams?.get('sort') ?? '';
  const sort = normalizeProductListSortApiValue(rawSort);
  const query = searchParams?.get('q') || '';

  const [items, setItems] = useState<ProductListItemApiDTO[]>([]);
  const [brands, setBrands] = useState<BrandApiDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isPending, startTransition] = useTransition();

  const abortRef = useRef<AbortController | null>(null);
  const bootFetchedRef = useRef(false);

  const [loadedTo, setLoadedTo] = useState(page);

  const filtersKey = useMemo(() => {
    const brand = selectedBrand || '';
    const selectedSort = sort || '';
    const trimmedQuery = (query || '').trim();
    return `${brand}__${selectedSort}__${trimmedQuery}`;
  }, [selectedBrand, sort, query]);

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

  const canLoadMore = !isBootSkeleton && !isPending && !isLoadingMore && loadedTo < totalPages;

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
    page,
    selectedBrand,
    sort,
    query,
    items,
    brands,
    totalPages,
    total,
    showMobileFilters,
    setShowMobileFilters,
    isPending,
    isLoadingMore,
    isBootSkeleton,
    isEmpty,
    loadedTo,
    updateParams,
    resetFilters,
    onLoadMore,
    canLoadMore,
  };
}
