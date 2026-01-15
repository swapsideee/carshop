'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import LoadMoreButton from '@/components/LoadMoreButton';

function Star({ filled, onClick, onMouseEnter, size = 20, clickable = true, title }) {
  return (
    <svg
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      title={title}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? '#84cc16' : 'none'}
      stroke="#84cc16"
      strokeWidth="1.5"
      className={clickable ? 'cursor-pointer' : ''}
      style={{ width: size, height: size }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.208 3.708a1 1 0 00.95.69h3.905c.969 0 1.371 1.24.588 1.81l-3.158 2.294a1 1 0 00-.363 1.118l1.208 3.708c.3.921-.755 1.688-1.538 1.118L12 13.347l-3.158 2.294c-.783.57-1.838-.197-1.538-1.118l1.208-3.708a1 1 0 00-.363-1.118L4.99 9.135c-.783-.57-.38-1.81.588-1.81h3.905a1 1 0 00.95-.69l1.208-3.708z"
      />
    </svg>
  );
}

function ReviewSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3 gap-3">
        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 w-5 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

function ReviewForm({ onNewReview }) {
  const MAX_COMMENT = 500;

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [authorName, setAuthorName] = useState('');

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const activeRating = hoverRating || rating;

  const ratingLabel =
    activeRating === 1
      ? 'Погано'
      : activeRating === 2
        ? 'Так собі'
        : activeRating === 3
          ? 'Нормально'
          : activeRating === 4
            ? 'Добре'
            : activeRating === 5
              ? 'Чудово'
              : '';

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/products?limit=60&page=1', { cache: 'no-store' });
        if (!res.ok) {
          if (!cancelled) setProducts([]);
          return;
        }

        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) setProducts(items);
      } catch {
        if (!cancelled) setProducts([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return Boolean(productId) && Boolean(authorName.trim()) && rating > 0 && !isPosting;
  }, [productId, authorName, rating, isPosting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!productId) return setError('Будь ласка, оберіть товар');
    if (!authorName.trim()) return setError("Будь ласка, введіть ім'я");
    if (rating === 0) return setError('Будь ласка, поставте оцiнку');

    setIsPosting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim() || null,
          authorName: authorName.trim(),
        }),
      });

      if (!res.ok) throw new Error(`POST /api/reviews failed: ${res.status}`);

      setProductId('');
      setAuthorName('');
      setRating(0);
      setHoverRating(0);
      setComment('');
      setSubmitted(true);
      onNewReview();
      setTimeout(() => setSubmitted(false), 2500);
    } catch (err) {
      console.error(err);
      setError('Сталася помилка під час надсилання відгуку.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Залишити відгук</h2>
        <p className="mt-1 text-sm text-gray-600">
          Оберіть товар, поставте оцінку та додайте коментар (за бажанням).
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Ваше ім&apos;я</label>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Наприклад, Ірина"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-600"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Товар</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-600"
          >
            <option value="">Оберіть товар</option>

            {products.map((p) => {
              const label = p.name && p.name !== p.model ? `${p.name} ${p.model}` : p.model;
              return (
                <option key={p.id} value={p.id} title={label}>
                  {label.length > 42 ? label.slice(0, 42) + '...' : label}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Оцінка</label>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  filled={num <= activeRating}
                  onMouseEnter={() => setHoverRating(num)}
                  onClick={() => setRating(num)}
                  title={`${num} / 5`}
                />
              ))}
            </div>

            {activeRating > 0 ? (
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">{activeRating} / 5</span>{' '}
                <span className="text-gray-400">•</span> <span>{ratingLabel}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-400">Оберіть оцінку</div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">
            Коментар <span className="text-gray-400 font-normal">(необов&apos;язково)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
            rows="4"
            placeholder="Ваш відгук"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-600"
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {comment.length}/{MAX_COMMENT}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={[
            'w-full rounded-xl px-4 py-2.5 text-base font-semibold transition',
            canSubmit
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed',
          ].join(' ')}
        >
          {isPosting ? 'Надсилаємо…' : 'Надіслати відгук'}
        </button>

        {submitted ? (
          <p className="text-center text-green-700 font-medium">Дякуємо за відгук!</p>
        ) : null}
        {error ? <p className="text-center text-red-600 font-medium">{error}</p> : null}
      </form>
    </div>
  );
}

function ReviewList({ refresh }) {
  const LIMIT = 5;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const abortRef = useRef(null);

  const fetchPage = async (p, { append } = { append: false }) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const res = await fetch(`/api/reviews?page=${p}&limit=${LIMIT}`, {
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
  };

  useEffect(() => {
    (async () => {
      try {
        setIsBootLoading(true);
        await fetchPage(1, { append: false });
      } catch (e) {
        console.error(e);
        setItems([]);
        setTotalPages(1);
        setTotal(0);
      } finally {
        setIsBootLoading(false);
      }
    })();

    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsBootLoading(true);
        await fetchPage(1, { append: false });
      } catch (e) {
        console.error(e);
        setItems([]);
        setTotalPages(1);
        setTotal(0);
      } finally {
        setIsBootLoading(false);
      }
    })();
  }, [refresh]);

  const canLoadMore = !isBootLoading && !isLoadingMore && page < totalPages;

  const onLoadMore = async () => {
    if (!canLoadMore) return;
    setIsLoadingMore(true);
    try {
      await fetchPage(page + 1, { append: true });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Останні відгуки</h2>
        <p className="mt-1 text-sm text-gray-600">
          Показано {items.length} з {total}
        </p>
      </div>

      {isBootLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Відгуків ще немає</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-gray-900 font-semibold wrap-break-word">
                      {r.name && r.name !== r.model ? `${r.name} ${r.model}` : r.model}
                    </div>
                  </div>

                  <div className="shrink-0 text-right text-sm text-gray-500 leading-tight">
                    {r.author_name ? (
                      <div className="font-medium text-gray-700">{r.author_name}</div>
                    ) : null}
                    <div>{new Date(r.created_at).toLocaleDateString('uk-UA')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} filled={n <= r.rating} size={18} clickable={false} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{Number(r.rating)} / 5</span>
                </div>

                {r.comment ? (
                  <p className="text-gray-700 leading-relaxed wrap-break-word whitespace-pre-wrap">
                    {r.comment}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="pt-5 flex justify-center">
            <LoadMoreButton onClick={onLoadMore} disabled={!canLoadMore} loading={isLoadingMore}>
              {page < totalPages ? 'Показати ще' : 'Більше немає'}
            </LoadMoreButton>
          </div>
        </>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleNewReview = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Відгуки</h1>
          <p className="mt-2 text-gray-600">Відгуки від наших покупців</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <ReviewForm onNewReview={handleNewReview} />
          <ReviewList refresh={refreshFlag} />
        </div>
      </div>
    </div>
  );
}
