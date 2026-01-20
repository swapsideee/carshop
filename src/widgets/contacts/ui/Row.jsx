'use client';

import { cx } from '@/shared/lib';

export default function Row({ icon: Icon, label, value, href, trailing }) {
  const base = cx(
    'group rounded-xl border border-gray-200/80 bg-white/70 p-4 shadow-sm transition',
    'hover:-translate-y-0.5 hover:shadow-md hover:bg-white',
  );

  const inner = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
        <Icon className="h-5 w-5 text-gray-700" />
      </div>

      <div className="flex-1">
        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-base font-semibold text-gray-900">{value}</div>
      </div>

      {trailing}
    </div>
  );

  return href ? (
    <a href={href} className={base}>
      {inner}
    </a>
  ) : (
    <div className={base}>{inner}</div>
  );
}
