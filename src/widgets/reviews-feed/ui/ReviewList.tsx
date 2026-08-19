import { useMemo } from 'react';

import type { ReviewFeedItemApiDTO } from '@/entities/review';
import { LoadMoreButton, Stars } from '@/shared/ui';

import ReviewSkeleton from './ReviewSkeleton';

type ReviewListProps = {
  items: ReviewFeedItemApiDTO[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
};

function getModelLabel(review: ReviewFeedItemApiDTO): string {
  const { name, model } = review;

  if (name && model && name !== model) return `${name} ${model}`;

  return model || name || '';
}

export default function ReviewList({
  items,
  total,
  loading,
  loadingMore,
  canLoadMore,
  onLoadMore,
}: ReviewListProps) {
  const shown = items.length;

  const headerText = useMemo(() => {
    if (loading) return 'Завантаження…';
    if (!shown) return 'Відгуків ще немає';

    return `Показано ${shown} з ${Number(total) || 0}`;
  }, [loading, shown, total]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Останні відгуки</h2>
        <p className="mt-1 text-sm text-gray-600">{headerText}</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <ReviewSkeleton key={index} />
          ))}
        </div>
      ) : shown === 0 ? (
        <p className="text-gray-500 text-center py-6">Відгуків ще немає</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((review) => {
              const rating = Math.max(1, Math.min(5, Number(review.rating) || 0));

              return (
                <div
                  key={review.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-gray-900 font-semibold wrap-break-word">
                        {getModelLabel(review)}
                      </div>
                    </div>

                    <div className="shrink-0 text-right text-sm text-gray-500 leading-tight">
                      {review.author_name ? (
                        <div className="font-medium text-gray-700">{review.author_name}</div>
                      ) : null}
                      <div>
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString('uk-UA')
                          : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Stars value={rating} />
                    <span className="text-sm text-gray-600">{rating} / 5</span>
                  </div>

                  {review.comment ? (
                    <p className="text-gray-700 leading-relaxed wrap-break-word whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="pt-5 flex justify-center">
            <LoadMoreButton onClick={onLoadMore} disabled={!canLoadMore} loading={loadingMore}>
              {canLoadMore ? 'Показати ще' : 'Більше немає'}
            </LoadMoreButton>
          </div>
        </>
      )}
    </div>
  );
}
