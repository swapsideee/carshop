'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const LIMIT_DEFAULT = 5;

export function useReviewsFeed({ limit = LIMIT_DEFAULT } = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const abortRef = useRef(null);
  const refreshNonceRef = useRef(0);

  const fetchPage = useCallback(
    async (p, { append } = { append: false }) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(`/api/reviews?page=${p}&limit=${limit}`, {
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`GET /api/reviews failed: ${res.status}`);
      const data = await res.json();

      const nextItems = Array.isArray(data?.items) ? data.items : [];
      const tp = Number(data?.totalPages) || 1;

      setTotalPages(tp);
      setPage(p);
      setTotal(Number(data?.total) || 0);

      setItems((prev) => (append ? [...prev, ...nextItems] : nextItems));
    },
    [limit],
  );

  const refresh = useCallback(async () => {
    refreshNonceRef.current += 1;
    const nonce = refreshNonceRef.current;

    setLoading(true);
    try {
      await fetchPage(1, { append: false });
    } catch (e) {
      console.error(e);
      if (nonce === refreshNonceRef.current) {
        setItems([]);
        setTotalPages(1);
        setTotal(0);
      }
    } finally {
      if (nonce === refreshNonceRef.current) setLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    refresh();
    return () => abortRef.current?.abort();
  }, [refresh]);

  const canLoadMore = !loading && !loadingMore && page < totalPages;

  const loadMore = useCallback(async () => {
    if (!canLoadMore) return;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, { append: true });
    } catch (e) {
      console.error(e);
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
