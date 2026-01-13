'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Funnel, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import FiltersPanel from '@/components/FiltersPanel';
import Pagination from '@/components/Pagination/Pagination';
import ProductCard from '@/components/ProductCard';

function SkeletonCard() {
  return (
    <div className="h-full rounded-xl border-2 border-gray-200 bg-white overflow-hidden">
      <div className="aspect-square bg-gray-100 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="h-5 w-full bg-gray-100 rounded animate-pulse" />
        <div className="pt-3 space-y-2">
          <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function AllProductsPage() {
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
  const loadedToRef = useRef(page);
  const bootFetchedRef = useRef(false);

  const loadedTo = loadedToRef.current;

  const filtersKey = useMemo(() => {
    const b = selectedBrand || '';
    const s = sort || '';
    const q = (query || '').trim();
    return `${b}__${s}__${q}`;
  }, [selectedBrand, sort, query]);

  const buildApiUrl = useMemo(() => {
    return (p) => {
      const params = new URLSearchParams();
      params.set('page', String(p));
      if (selectedBrand) params.set('brand', selectedBrand);
      if (sort) params.set('sort', sort);
      if (query && query.trim()) params.set('q', query.trim());
      return `/api/products?${params.toString()}`;
    };
  }, [selectedBrand, sort, query]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateParams = (updates, { scrollTop = true } = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === false)
        params.delete(key);
      else params.set(key, String(value));
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

    fetch('/api/brands')
      .then((r) => r.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [brands.length]);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    loadedToRef.current = page;

    fetch(buildApiUrl(page), { cache: 'no-store', signal: controller.signal })
      .then((r) => r.json())
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
  }, [page, filtersKey, buildApiUrl]);

  const isBootSkeleton = !bootFetchedRef.current && items.length === 0;
  const isEmpty = !isBootSkeleton && items.length === 0;

  const canLoadMore =
    !isBootSkeleton && !isPending && !isLoadingMore && loadedToRef.current < totalPages;

  const onLoadMore = async () => {
    if (!canLoadMore) return;

    const nextPage = loadedToRef.current + 1;
    setIsLoadingMore(true);

    try {
      const res = await fetch(buildApiUrl(nextPage), { cache: 'no-store' });
      const data = await res.json();
      const chunk = Array.isArray(data?.items) ? data.items : [];

      loadedToRef.current = nextPage;

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

  return (
    <div className="flex flex-col lg:flex-row lg:justify-center px-4 gap-8 py-10 min-h-screen">
      <div className="hidden lg:block w-72 shrink-0">
        <div className="lg:sticky lg:top-24">
          <FiltersPanel
            query={query}
            setQuery={(v) => updateParams({ q: v })}
            brands={brands}
            selectedBrand={selectedBrand}
            setSelectedBrand={(v) => updateParams({ brand: v })}
            sort={sort}
            setSort={(v) => updateParams({ sort: v })}
            resetFilters={resetFilters}
            total={total}
            shown={items.length}
            page={page}
          />
        </div>
      </div>

      <div className="lg:hidden w-full mb-4">
        <button
          onClick={() => setShowMobileFilters((v) => !v)}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
        >
          Фільтри
          <Funnel className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mt-4"
            >
              <FiltersPanel
                query={query}
                setQuery={(v) => updateParams({ q: v })}
                brands={brands}
                selectedBrand={selectedBrand}
                setSelectedBrand={(v) => updateParams({ brand: v })}
                sort={sort}
                setSort={(v) => updateParams({ sort: v })}
                resetFilters={resetFilters}
                total={total}
                shown={items.length}
                page={page}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 max-w-325 w-full">
        <main>
          {isBootSkeleton ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="text-center text-gray-500 mt-20">Нічого не знайдено</div>
          ) : (
            <>
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} clickable />
                  ))}
                </div>

                <AnimatePresence>
                  {isPending && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="pointer-events-none absolute inset-0 rounded-xl bg-white/35 backdrop-blur-[1px]"
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={!canLoadMore}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-5 w-5 ${isLoadingMore ? 'animate-spin' : ''}`} />
                  Показати ще
                </button>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  loadedTo={Math.max(page, loadedToRef.current)}
                  onChange={(p) => updateParams({ page: p }, { scrollTop: true })}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
