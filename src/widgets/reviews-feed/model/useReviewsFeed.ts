import { useCallback, useEffect, useRef, useState } from 'react';

import type { ReviewFeedItemApiDTO, ReviewsPageApiResult } from '@/entities/review';

const LIMIT_DEFAULT = 5;

export type UseReviewsFeedOptions = {
  limit?: number;
};

export type UseReviewsFeedResult = {
  items: ReviewFeedItemApiDTO[];
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  loadingMore: boolean;
  canLoadMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
};

type FetchPageOptions = {
  append?: boolean;
};

function isAbortError(error: unknown): boolean {
  if ((typeof error !== 'object' && typeof error !== 'function') || error === null) {
    return false;
  }

  return (
    ('name' in error && error.name === 'AbortError') ||
    ('code' in error && error.code === 20) ||
    (typeof DOMException !== 'undefined' &&
      error instanceof DOMException &&
      error.name === 'AbortError')
  );
}

async function requestReviewsPage(
  page: number,
  limit: number,
  signal: AbortSignal,
): Promise<ReviewsPageApiResult<ReviewFeedItemApiDTO>> {
  const response = await fetch(`/api/reviews?page=${page}&limit=${limit}`, {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(`GET /api/reviews failed: ${response.status}`);
  }

  return response.json();
}

export function useReviewsFeed({
  limit = LIMIT_DEFAULT,
}: UseReviewsFeedOptions = {}): UseReviewsFeedResult {
  const [items, setItems] = useState<ReviewFeedItemApiDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [settledLimit, setSettledLimit] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const refreshNonceRef = useRef(0);

  const loading = settledLimit !== limit || refreshing;

  const fetchPage = useCallback(
    async (nextPage: number, { append = false }: FetchPageOptions = {}): Promise<void> => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      const data = await requestReviewsPage(nextPage, limit, controller.signal);

      if (controller.signal.aborted || abortRef.current !== controller) return;

      const nextItems = Array.isArray(data?.items) ? data.items : [];
      const nextTotalPages = Number(data?.totalPages) || 1;

      setTotalPages(nextTotalPages);
      setPage(nextPage);
      setTotal(Number(data?.total) || 0);
      setItems((previousItems) => (append ? [...previousItems, ...nextItems] : nextItems));
    },
    [limit],
  );

  const refresh = useCallback(async (): Promise<void> => {
    refreshNonceRef.current += 1;
    const nonce = refreshNonceRef.current;

    setRefreshing(true);

    try {
      await fetchPage(1, { append: false });
    } catch (error: unknown) {
      if (isAbortError(error)) return;

      console.error(error);

      if (nonce === refreshNonceRef.current) {
        setItems([]);
        setPage(1);
        setTotalPages(1);
        setTotal(0);
      }
    } finally {
      if (nonce === refreshNonceRef.current) {
        setRefreshing(false);
      }
    }
  }, [fetchPage]);

  useEffect(() => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    void requestReviewsPage(1, limit, controller.signal)
      .then((data) => {
        if (controller.signal.aborted || abortRef.current !== controller) return;

        const nextItems = Array.isArray(data?.items) ? data.items : [];

        setItems(nextItems);
        setPage(1);
        setTotalPages(Number(data?.totalPages) || 1);
        setTotal(Number(data?.total) || 0);
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || abortRef.current !== controller) return;

        console.error(error);

        setItems([]);
        setPage(1);
        setTotalPages(1);
        setTotal(0);
      })
      .finally(() => {
        if (!controller.signal.aborted && abortRef.current === controller) {
          setSettledLimit(limit);
        }
      });

    return () => {
      controller.abort();

      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    };
  }, [limit]);

  const canLoadMore = !loading && !loadingMore && page < totalPages;

  const loadMore = useCallback(async (): Promise<void> => {
    if (!canLoadMore) return;

    setLoadingMore(true);

    try {
      await fetchPage(page + 1, { append: true });
    } catch (error: unknown) {
      if (isAbortError(error)) return;

      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  }, [canLoadMore, fetchPage, page]);

  return {
    items,
    page,
    totalPages,
    total,
    loading,
    loadingMore,
    canLoadMore,
    refresh,
    loadMore,
  };
}
