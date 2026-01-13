'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useMemo } from 'react';

import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onChange, scrollTargetId, loadedTo }) {
  const clamp = (n) => Math.min(Math.max(n, 1), totalPages);

  const loadedMax = Math.max(page, Number(loadedTo) || page);

  // сколько страниц показываем в "окне" загруженных
  const windowSize = 5;

  const items = useMemo(() => {
    if (totalPages <= 1) return [];

    const range = (from, to) => {
      const out = [];
      for (let i = from; i <= to; i++) out.push(i);
      return out;
    };

    // если страниц мало — показываем все
    if (totalPages <= 7) return range(1, totalPages);

    // --- ВОТ ТУТ СУТЬ ---
    // Мы показываем "хвост" загруженных страниц: loadedMax-windowSize+1 ... loadedMax
    const tailEnd = Math.min(totalPages - 1, loadedMax); // чтобы оставить место под last page
    const tailStart = Math.max(2, tailEnd - (windowSize - 1)); // не залезаем на 1, минимум 2

    const res = [1];

    // троеточие после 1, если окно начинается далеко
    if (tailStart > 2) res.push('…');
    else res.push(2);

    // само окно
    res.push(...range(tailStart, tailEnd));

    // если справа ещё есть страницы до last — ставим …
    if (tailEnd < totalPages - 1) res.push('…');
    else if (tailEnd === totalPages - 2) res.push(totalPages - 1);

    res.push(totalPages);

    // чистим дубли
    const compact = [];
    const seen = new Set();
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

  const go = (next) => {
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

              // loaded подсветка: страница считается "загруженной", если <= loadedMax
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
