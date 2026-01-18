'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { clampRating } from '@/entities/review';
import { getReviews, REVIEWS_LIMIT_DEFAULT } from '@/entities/review/api/client';

export function useProductReviews({
  productId,
  limit = REVIEWS_LIMIT_DEFAULT,
  enabled = true,
} = {}) {
  const pid = Number(productId);
  const canRun = enabled && Number.isFinite(pid) && pid > 0;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [total, setTotal] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  const abortRef = useRef(null);

  const hasMore = page < totalPages;

  const reset = useCallback(() => {
    setItems([]);
    setLoading(false);
    setLoadingMore(false);
    setPage(1);
    setTotalPages(1);
    setTotal(0);
    setAvgRating(0);
  }, []);

  const loadPage = useCallback(
    async ({ nextPage, append }) => {
      if (!canRun) return;

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        append ? setLoadingMore(true) : setLoading(true);

        const data = await getReviews({
          productId: pid,
          page: nextPage,
          limit,
          signal: controller.signal,
        });

        const nextItems = Array.isArray(data?.items) ? data.items : [];
        const nextTotalPages = Number(data?.totalPages) || 1;
        const nextTotal = Number(data?.total) || 0;
        const nextAvg = clampRating(Number(data?.avgRating) || 0);

        setTotalPages(nextTotalPages);
        setTotal(nextTotal);
        setAvgRating(nextAvg);
        setPage(nextPage);

        if (append) {
          setItems((prev) => {
            const prevArr = Array.isArray(prev) ? prev : [];
            const seen = new Set(prevArr.map((x) => x?.id));
            const filtered = nextItems.filter((x) => !seen.has(x?.id));
            return [...prevArr, ...filtered];
          });
        } else {
          setItems(nextItems);
        }
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (!append) setItems([]);
        if (!append) {
          setTotalPages(1);
          setTotal(0);
          setAvgRating(0);
          setPage(1);
        }
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [canRun, pid, limit],
  );

  const reload = useCallback(() => {
    reset();
    return loadPage({ nextPage: 1, append: false });
  }, [reset, loadPage]);

  const loadMore = useCallback(() => {
    if (!canRun) return;
    if (loading || loadingMore) return;
    if (!hasMore) return;
    return loadPage({ nextPage: page + 1, append: true });
  }, [canRun, loading, loadingMore, hasMore, loadPage, page]);

  useEffect(() => {
    if (!canRun) {
      reset();
      return;
    }

    reload();

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [pid, limit, enabled, canRun, reload, reset]);

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
