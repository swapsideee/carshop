'use client';

export default function ReviewSkeleton() {
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
