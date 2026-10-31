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

  const hasMore = canRun && page < totalPages;

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

        if (controller.signal.aborted || abortRef.current !== controller) return;

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

        if (!append && abortRef.current === controller) {
          setItems([]);
          setTotalPages(1);
          setTotal(0);
          setAvgRating(0);
          setPage(1);
        }
      } finally {
        if (abortRef.current === controller) {
          if (append) {
            setLoadingMore(false);
          } else {
            setLoading(false);
          }
        }
      }
    },
    [canRun, parsedProductId, limit],
  );

  const reload = useCallback(async (): Promise<void> => {
    reset();

    await loadPage({
      nextPage: 1,
      append: false,
    });
  }, [reset, loadPage]);

  const loadMore = useCallback((): Promise<void> | undefined => {
    if (!canRun || loading || loadingMore || !hasMore) return;

    return loadPage({
      nextPage: page + 1,
      append: true,
    });
  }, [canRun, loading, loadingMore, hasMore, loadPage, page]);

  useEffect(() => {
    if (!canRun) {
      abortRef.current?.abort();
      return;
    }

    const controller = new AbortController();

    abortRef.current?.abort();
    abortRef.current = controller;

    void getReviews({
      productId: parsedProductId,
      page: 1,
      limit,
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted || abortRef.current !== controller) return;

        const nextItems = Array.isArray(data?.items) ? data.items : [];

        setItems(nextItems);
        setPage(1);
        setTotalPages(Number(data?.totalPages) || 1);
        setTotal(Number(data?.total) || 0);
        setAvgRating(clampRating(Number(data?.avgRating) || 0));
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || abortRef.current !== controller) return;

        setItems([]);
        setPage(1);
        setTotalPages(1);
        setTotal(0);
        setAvgRating(0);
      })
      .finally(() => {
        if (!controller.signal.aborted && abortRef.current === controller) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();

      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    };
  }, [canRun, parsedProductId, limit]);

  return useMemo(() => {
    if (!canRun) {
      return {
        items: [],
        loading: false,
        loadingMore: false,
        page: 1,
        totalPages: 1,
        total: 0,
        avgRating: 0,
        hasMore: false,
        loadMore,
        reload,
      };
    }

    return {
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
    };
  }, [
    canRun,
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
  ]);
}
