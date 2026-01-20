'use client';

import { cx } from '@/shared/lib';

export default function StatusBadge({ open, title }) {
  return (
    <div
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm',
        open
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-rose-200 bg-rose-50 text-rose-800',
      )}
      title={title}
      aria-label={open ? 'Відкрито зараз' : 'Зачинено зараз'}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={cx(
            'absolute inline-flex h-full w-full rounded-full',
            open ? 'bg-emerald-500/50 animate-ping' : 'bg-rose-500/35',
          )}
        />
        <span
          className={cx(
            'relative inline-flex h-2.5 w-2.5 rounded-full',
            open ? 'bg-emerald-600' : 'bg-rose-600',
          )}
        />
      </span>
      {open ? 'Відкрито зараз' : 'Зачинено зараз'}
    </div>
  );
}
