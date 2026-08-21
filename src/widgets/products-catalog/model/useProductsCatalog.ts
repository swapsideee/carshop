'use client';

import { type Dispatch, type SetStateAction, useState } from 'react';

import { type BrandApiDTO } from '@/entities/brand';
import { type ProductListItemApiDTO, type ProductListSortApiValue } from '@/entities/product';

import { useCatalogData } from './useCatalogData';
import {
  type CatalogSearchParamUpdates,
  type CatalogUrlUpdateOptions,
  useCatalogSearchParams,
} from './useCatalogSearchParams';

export type { CatalogSearchParamUpdates, CatalogUrlUpdateOptions } from './useCatalogSearchParams';

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

export function useProductsCatalog(): UseProductsCatalogResult {
  const { page, selectedBrand, sort, query, isPending, updateParams, resetFilters } =
    useCatalogSearchParams();
  const {
    items,
    brands,
    totalPages,
    total,
    isLoadingMore,
    isBootSkeleton,
    isEmpty,
    loadedTo,
    onLoadMore: loadMore,
    canLoadMore: dataCanLoadMore,
  } = useCatalogData({ page, selectedBrand, sort, query });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const canLoadMore = !isPending && dataCanLoadMore;

  const onLoadMore = async (): Promise<void> => {
    if (isPending) return;

    await loadMore();
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
