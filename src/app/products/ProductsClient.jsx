'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Funnel } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import FiltersPanel from '@/components/FiltersPanel';
import LoadMoreButton from '@/components/LoadMoreButton';
import Pagination from '@/components/Pagination/Pagination';
import ProductCard from '@/components/ProductCard';

function SkeletonCard() {
  return (
    <div className="h-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white">
      <div className="aspect-square animate-pulse bg-gray-100" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
        <div className="space-y-2 pt-3">
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);

  useEffect(() => {
    document.title = `Каталог. Сторінка ${page} | PLAST-AVTO.`;
  }, [page]);

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
    <div className="flex min-h-screen flex-col gap-8 px-4 py-10 lg:flex-row lg:justify-center">
      <div className="hidden w-72 shrink-0 lg:block">
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

      <div className="mb-4 w-full lg:hidden">
        <button
          onClick={() => setShowMobileFilters((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white"
        >
          Фільтри
          <Funnel className="h-5 w-5" />
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

      <div className="w-full flex-1 max-w-325">
        <main>
          {isBootSkeleton ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="mt-20 text-center text-gray-500">Нічого не знайдено</div>
          ) : (
            <>
              <div className="relative">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
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
                <LoadMoreButton
                  onClick={onLoadMore}
                  disabled={!canLoadMore}
                  loading={isLoadingMore}
                >
                  Показати ще
                </LoadMoreButton>

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
