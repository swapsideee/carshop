'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useMemo } from 'react';

import styles from './Pagination.module.css';

type PaginationItem = number | '…';

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  scrollTargetId?: string;
  loadedTo?: number | string | null;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  scrollTargetId,
  loadedTo,
}: PaginationProps) {
  const clamp = (n: number) => Math.min(Math.max(n, 1), totalPages);

  const loadedMax = Math.max(page, Number(loadedTo) || page);

  const windowSize = 5;

  const items = useMemo<PaginationItem[]>(() => {
    if (totalPages <= 1) return [];

    const range = (from: number, to: number) => {
      const out: number[] = [];
      for (let i = from; i <= to; i++) out.push(i);
      return out;
    };

    if (totalPages <= 7) return range(1, totalPages);

    const tailEnd = Math.min(totalPages - 1, loadedMax);
    const tailStart = Math.max(2, tailEnd - (windowSize - 1));

    const res: PaginationItem[] = [1];

    if (tailStart > 2) res.push('…');
    else res.push(2);

    res.push(...range(tailStart, tailEnd));

    if (tailEnd < totalPages - 1) res.push('…');
    else if (tailEnd === totalPages - 2) res.push(totalPages - 1);

    res.push(totalPages);

    const compact: PaginationItem[] = [];
    const seen = new Set<number>();

    for (const it of res) {
      if (typeof it === 'number') {
        if (seen.has(it)) continue;
        seen.add(it);
      }
      compact.push(it);
    }

    return compact;
  }, [totalPages, loadedMax]);

  const scrollToTop = () => {
    if (scrollTargetId) {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const go = (next: number) => {
    if (next === page) return;
    onChange(next);
    setTimeout(scrollToTop, 0);
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={styles.wrap} aria-label="Pagination">
      <div className={styles.mobile}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => go(clamp(page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className={styles.mobileInfo}>
          <span className={styles.mobilePage}>{page}</span>
          <span className={styles.mobileSep}>/</span>
          <span className={styles.mobileTotal}>{totalPages}</span>
        </div>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => go(clamp(page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className={styles.desktop}>
        <div className={styles.pill}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => go(1)}
            disabled={page === 1}
            aria-label="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => go(clamp(page - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className={styles.pages}>
            {items.map((it, idx) => {
              if (it === '…') {
                return (
                  <span key={`e-${idx}`} className={styles.ellipsis}>
                    …
                  </span>
                );
              }

              const p = it;
              const active = p === page;
              const loaded = !active && p <= loadedMax;

              return (
                <button
                  key={p}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  className={
                    active ? styles.pageBtnActive : loaded ? styles.pageBtnLoaded : styles.pageBtn
                  }
                  onClick={() => go(p)}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => go(clamp(page + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => go(totalPages)}
            disabled={page === totalPages}
            aria-label="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
