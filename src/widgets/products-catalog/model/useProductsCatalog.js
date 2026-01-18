'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { getBrands } from '@/entities/brand';
import { getProducts } from '@/entities/product/api/client';

export function useProductsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const selectedBrand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '';
  const query = searchParams.get('q') || '';

  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isPending, startTransition] = useTransition();

  const abortRef = useRef(null);
  const bootFetchedRef = useRef(false);

  const [loadedTo, setLoadedTo] = useState(page);

  const filtersKey = useMemo(() => {
    const b = selectedBrand || '';
    const s = sort || '';
    const q = (query || '').trim();
    return `${b}__${s}__${q}`;
  }, [selectedBrand, sort, query]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateParams = (updates, { scrollTop = true } = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if ('brand' in updates || 'sort' in updates || 'q' in updates) params.set('page', '1');

    const href = `/products?${params.toString()}`;

    startTransition(() => {
      router.push(href, { scroll: false });
    });

    if (scrollTop) requestAnimationFrame(scrollToTop);
  };

  const resetFilters = () => {
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
    if (abortRef.current) abortRef.current.abort();
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

        const next = Array.isArray(data?.items) ? data.items : [];
        setItems(next);
        setTotalPages(Number(data?.totalPages) || 1);
        setTotal(Number(data?.total) || 0);

        bootFetchedRef.current = true;
        setIsLoadingMore(false);
      })
      .catch((e) => {
        if (e?.name === 'AbortError') return;

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

  const onLoadMore = async () => {
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

      const chunk = Array.isArray(data?.items) ? data.items : [];

      setLoadedTo(nextPage);

      setTotalPages(Number(data?.totalPages) || totalPages);
      setTotal(Number(data?.total) || total);

      setItems((prev) => {
        const merged = [...(Array.isArray(prev) ? prev : []), ...chunk];
        const seen = new Set();
        const out = [];
        for (const it of merged) {
          const key = it?.id ?? `${it?.slug ?? ''}_${it?.model ?? ''}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(it);
        }
        return out;
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
