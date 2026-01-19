'use client';

import { useRef } from 'react';

import { ProductCard } from '@/entities/product';
import { cx } from '@/shared/lib';

export default function RelatedRow({ title, items, loading }) {
  const ref = useRef(null);
  const canShow = Array.isArray(items) && items.length > 0;

  const scrollByCards = (dir) => {
    const el = ref.current;
    if (!el) return;

    const first = el.querySelector('[data-card="1"]');
    const cardW = first?.getBoundingClientRect?.().width || 260;
    const gap = 12;

    el.scrollBy({ left: dir * (cardW + gap) * 2, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>

      {loading && !canShow ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200">
          Завантаження...
        </div>
      ) : !canShow ? null : (
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className={cx(
              'absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex',
              'h-12 w-12 items-center justify-center rounded-full',
              'bg-transparent ring-1 ring-gray-200',
              'text-gray-500 transition hover:text-gray-900 hover:ring-gray-300 active:scale-95',
            )}
            aria-label="Prev"
          >
            <span className="text-2xl leading-none">←</span>
          </button>

          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className={cx(
              'absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex',
              'h-12 w-12 items-center justify-center rounded-full',
              'bg-transparent ring-1 ring-gray-200',
              'text-gray-500 transition hover:text-gray-900 hover:ring-gray-300 active:scale-95',
            )}
            aria-label="Next"
          >
            <span className="text-2xl leading-none">→</span>
          </button>

          <div
            ref={ref}
            className={cx(
              'flex gap-3 overflow-x-auto',
              'px-1 pb-5',
              'overscroll-x-contain',
              'snap-x snap-proximity',
            )}
          >
            {items.slice(0, 16).map((p, idx) => (
              <div
                key={p.id}
                data-card={idx === 0 ? '1' : undefined}
                className="w-[70%] shrink-0 snap-start sm:w-[44%] md:w-[32%] xl:w-[24%]"
              >
                <ProductCard product={p} clickable />
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              className={cx(
                'inline-flex items-center justify-center rounded-full',
                'h-12 w-12 ring-1 ring-gray-200',
                'text-gray-500 transition hover:text-gray-900 hover:ring-gray-300 active:scale-95',
              )}
              aria-label="Prev"
            >
              <span className="text-2xl leading-none">←</span>
            </button>

            <button
              type="button"
              onClick={() => scrollByCards(1)}
              className={cx(
                'inline-flex items-center justify-center rounded-full',
                'h-12 w-12 ring-1 ring-gray-200',
                'text-gray-500 transition hover:text-gray-900 hover:ring-gray-300 active:scale-95',
              )}
              aria-label="Next"
            >
              <span className="text-2xl leading-none">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
