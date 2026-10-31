import { useEffect, useRef, useState } from 'react';

import { type BrandApiDTO, getBrands } from '@/entities/brand';

import { sortBrands } from './sortBrands';

const INITIAL_VISIBLE_BRANDS = 8;
const LOAD_MORE_STEP = 6;

export type UseBrandBannerResult = {
  shownBrands: BrandApiDTO[];
  loading: boolean;
  canLoadMore: boolean;
  loadMore: () => void;
};

export function useBrandBanner(): UseBrandBannerResult {
  const [brands, setBrands] = useState<BrandApiDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_BRANDS);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    const loadBrands = async (): Promise<void> => {
      setLoading(true);

      try {
        const data = await getBrands({ signal: controller.signal });

        if (requestId !== requestIdRef.current) return;

        const safeBrands = Array.isArray(data) ? data : [];

        setBrands(sortBrands(safeBrands));
        setVisibleCount(INITIAL_VISIBLE_BRANDS);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;

        console.error('Error loading brands:', error);

        if (requestId === requestIdRef.current) {
          setBrands([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    void loadBrands();

    return () => {
      controller.abort();
    };
  }, []);

  const shownBrands = brands.slice(0, visibleCount);
  const canLoadMore = !loading && visibleCount < brands.length;

  const loadMore = (): void => {
    setVisibleCount((current) => Math.min(current + LOAD_MORE_STEP, brands.length));
  };

  return {
    shownBrands,
    loading,
    canLoadMore,
    loadMore,
  };
}
