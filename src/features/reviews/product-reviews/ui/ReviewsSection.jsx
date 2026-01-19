'use client';

import { clampRating } from '@/entities/review';
import { formatDateUA } from '@/shared/lib';
import { LoadMoreButton, Stars } from '@/shared/ui';

import { useProductReviews } from '../model/useProductReviews';
import ReviewSkeleton from './ProductReviewsSkeleton';

export default function ReviewsSection({ productId }) {
  const { items, loading, loadingMore, total, avgRating, hasMore, loadMore } = useProductReviews({
    productId,
    enabled: true,
  });

  const avgAll = clampRating(avgRating);
  const totalAll = Number(total) || 0;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Відгуки</h2>
          <p className="mt-1 text-sm text-gray-500">
            {loading && items.length === 0
              ? 'Завантаження...'
              : totalAll === 0
                ? 'Поки що відгуків немає'
                : `Середня оцінка: ${avgAll.toFixed(1)} • Відгуків: ${totalAll}`}
          </p>
        </div>

        {totalAll > 0 && (
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
            <p className="text-xs text-gray-500">Рейтинг</p>
            <div className="mt-1 flex items-center gap-2">
              <Stars value={avgAll} />
              <span className="text-sm font-semibold text-gray-900">{avgAll.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      {loading && items.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <ReviewSkeleton />
          <ReviewSkeleton />
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>
      ) : totalAll === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200">
          Поки що немає відгуків. Саме ваш відгук може стати першим!
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((r) => {
              const ratingRaw = clampRating(Number(r.rating) || 0);
              const ratingInt = Math.round(ratingRaw);

              return (
                <div
                  key={r.id}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {r.author_name || 'Анонім'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {r.created_at ? formatDateUA(r.created_at) : ''}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Stars value={ratingInt} />
                      <span className="text-xs font-semibold text-gray-700">{ratingInt}/5</span>
                    </div>
                  </div>

                  <div className="mt-4 h-px w-full bg-gray-100" />

                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-800">
                    {r.comment}
                  </p>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <LoadMoreButton
                onClick={loadMore}
                loading={loadingMore}
                disabled={loading || loadingMore}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
