'use client';

import { useCallback } from 'react';

import { useReviewsFeed } from '../model/useReviewsFeed';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

export default function ReviewsFeed() {
  const { items, total, loading, loadingMore, canLoadMore, refresh, loadMore } = useReviewsFeed({
    limit: 5,
  });

  const handleNewReview = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Відгуки</h1>
        <p className="mt-2 text-gray-600">Відгуки від наших покупців</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ReviewForm onNewReview={handleNewReview} />
        <ReviewList
          items={items}
          total={total}
          loading={loading}
          loadingMore={loadingMore}
          canLoadMore={canLoadMore}
          onLoadMore={loadMore}
        />
      </div>
    </>
  );
}
