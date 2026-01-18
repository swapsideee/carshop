'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Funnel } from 'lucide-react';
import { useEffect } from 'react';

import ProductCard from '@/entities/product/ui/ProductCard/ProductCard';
import FiltersPanel from '@/features/products/catalog-filters/ui/FiltersPanel';
import LoadMoreButton from '@/shared/ui/LoadMoreButton/LoadMoreButton';
import Pagination from '@/shared/ui/Pagination/Pagination';

import { useProductsCatalog } from '../model/useProductsCatalog';
import SkeletonCard from './SkeletonCard';

export default function ProductsCatalog() {
  const {
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
  } = useProductsCatalog();

  useEffect(() => {
    document.title = `Каталог. Сторінка ${page} | PLAST-AVTO.`;
  }, [page]);

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
                  loadedTo={Math.max(page, loadedTo)}
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
