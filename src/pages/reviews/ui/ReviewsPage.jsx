'use client';

import ReviewsFeed from '@/widgets/reviews-feed';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ReviewsFeed />
      </div>
    </div>
  );
}
