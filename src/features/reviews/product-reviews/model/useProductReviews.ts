import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  clampRating,
  getReviews,
  type ReviewApiDTO,
  REVIEWS_LIMIT_DEFAULT,
} from '@/entities/review';

export type UseProductReviewsOptions = {
  productId?: number | string | null;
  limit?: number;
  enabled?: boolean;
};

export type UseProductReviewsResult = {
  items: ReviewApiDTO[];
  loading: boolean;
  loadingMore: boolean;
  page: number;
  totalPages: number;
  total: number;
  avgRating: number;
  hasMore: boolean;
  loadMore: () => Promise<void> | undefined;
  reload: () => Promise<void>;
};

type LoadPageOptions = {
  nextPage: number;
  append: boolean;
};

function isAbortError(error: unknown): boolean {
  return (
    (typeof error === 'object' || typeof error === 'function') &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  );
}

export function useProductReviews({
  productId,
  limit = REVIEWS_LIMIT_DEFAULT,
  enabled = true,
}: UseProductReviewsOptions = {}): UseProductReviewsResult {
  const parsedProductId = Number(productId);
  const canRun = enabled && Number.isFinite(parsedProductId) && parsedProductId > 0;

  const [items, setItems] = useState<ReviewApiDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [total, setTotal] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  const abortRef = useRef<AbortController | null>(null);

  const hasMore = page < totalPages;

  const reset = useCallback((): void => {
    setItems([]);
    setLoading(false);
    setLoadingMore(false);
    setPage(1);
    setTotalPages(1);
    setTotal(0);
    setAvgRating(0);
  }, []);

  const loadPage = useCallback(
    async ({ nextPage, append }: LoadPageOptions): Promise<void> => {
      if (!canRun) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const data = await getReviews({
          productId: parsedProductId,
          page: nextPage,
          limit,
          signal: controller.signal,
        });

        const nextItems = Array.isArray(data?.items) ? data.items : [];
        const nextTotalPages = Number(data?.totalPages) || 1;
        const nextTotal = Number(data?.total) || 0;
        const nextAvgRating = clampRating(Number(data?.avgRating) || 0);

        setTotalPages(nextTotalPages);
        setTotal(nextTotal);
        setAvgRating(nextAvgRating);
        setPage(nextPage);

        if (append) {
          setItems((previousItems) => {
            const seen = new Set(previousItems.map((item) => item.id));
            const newItems = nextItems.filter((item) => !seen.has(item.id));

            return [...previousItems, ...newItems];
          });
        } else {
          setItems(nextItems);
        }
      } catch (error: unknown) {
        if (isAbortError(error)) return;

        if (!append) {
          setItems([]);
          setTotalPages(1);
          setTotal(0);
          setAvgRating(0);
          setPage(1);
        }
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [canRun, parsedProductId, limit],
  );

  const reload = useCallback((): Promise<void> => {
    reset();

    return loadPage({ nextPage: 1, append: false });
  }, [reset, loadPage]);

  const loadMore = useCallback((): Promise<void> | undefined => {
    if (!canRun || loading || loadingMore || !hasMore) return;

    return loadPage({ nextPage: page + 1, append: true });
  }, [canRun, loading, loadingMore, hasMore, loadPage, page]);

  useEffect(() => {
    if (!canRun) {
      reset();
      return;
    }

    void reload();

    return () => {
      abortRef.current?.abort();
    };
  }, [parsedProductId, limit, enabled, canRun, reload, reset]);

  return useMemo(
    () => ({
      items,
      loading,
      loadingMore,
      page,
      totalPages,
      total,
      avgRating,
      hasMore,
      loadMore,
      reload,
    }),
    [items, loading, loadingMore, page, totalPages, total, avgRating, hasMore, loadMore, reload],
  );
}
