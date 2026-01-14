'use client';

import { RefreshCw } from 'lucide-react';

export default function LoadMoreButton({
  onClick,
  disabled = false,
  loading = false,
  children = 'Показати ще',
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5',
        'text-sm font-semibold text-gray-900 shadow-sm transition',
        'hover:bg-gray-50 hover:border-gray-400',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
    >
      <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
      {children}
    </button>
  );
}
