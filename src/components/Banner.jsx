'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import LoadMoreButton from '@/components/LoadMoreButton';

function SkeletonCard() {
  return (
    <div className="w-full aspect-square rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="h-full w-full p-6 flex flex-col items-center justify-center">
        <div className="w-full h-[70%] rounded-xl bg-gray-100 animate-pulse" />
        <div className="mt-4 h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

const CHIPS = ['30+ брендів', '250+ товарів', 'Самовивіз Харків'];

export default function Banner() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  const reqIdRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    const myReqId = ++reqIdRef.current;

    const loadBrands = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/brands', { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load brands: ${res.status}`);

        const data = await res.json();
        if (myReqId !== reqIdRef.current) return;

        const safe = Array.isArray(data) ? data : [];

        const sorted = [...safe].sort((a, b) => {
          const aName = a?.name || '';
          const bName = b?.name || '';

          const aCyr = /[А-Яа-яІіЇїЄє]/.test(aName);
          const bCyr = /[А-Яа-яІіЇїЄє]/.test(bName);

          if (aCyr !== bCyr) return aCyr ? 1 : -1;

          return aName.localeCompare(bName, 'uk', { sensitivity: 'base' });
        });

        setBrands(sorted);
        setVisibleCount(8);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('Error loading brands:', err);
        if (myReqId === reqIdRef.current) setBrands([]);
      } finally {
        if (myReqId === reqIdRef.current) setLoading(false);
      }
    };

    loadBrands();
    return () => controller.abort();
  }, []);

  const shownBrands = useMemo(() => brands.slice(0, visibleCount), [brands, visibleCount]);

  const step = 6;
  const canLoadMore = !loading && visibleCount < brands.length;

  const onLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + step, brands.length));
  };

  const itemInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 };
  const itemAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const itemExit = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 };

  return (
    <section className="mt-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-black/10 bg-white/75 backdrop-blur supports-backdrop-filter:bg-white/60 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.55)]">
          <div className="pointer-events-none mx-6 h-px bg-linear-to-r from-transparent via-white/80 to-transparent" />

          <div className="p-6 sm:p-8">
            <div className="text-left sm:text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Оберіть марку авто
              </h2>
              <p className="mt-2 text-slate-600">Підберемо підкрилки під вашу модель.</p>

              <div className="mt-4 flex flex-wrap gap-2 justify-start sm:justify-center">
                {CHIPS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-start sm:justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                >
                  Перейти до каталогу
                </Link>
              </div>
            </div>

            <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

              <AnimatePresence initial={false}>
                {!loading &&
                  shownBrands.map((brand) => (
                    <motion.div
                      key={brand.id}
                      initial={itemInitial}
                      animate={itemAnimate}
                      exit={itemExit}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      layout
                    >
                      <Link
                        href={`/products/${brand.slug}`}
                        className="group relative block w-full aspect-square rounded-2xl border border-gray-200 bg-white/85 backdrop-blur supports-backdrop-filter:bg-white/70 overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5 hover:border-lime-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gray-100 blur-2xl" />
                        </div>

                        <div className="h-full w-full p-6 flex flex-col items-center justify-center">
                          <div className="relative w-full aspect-3/2">
                            <Image
                              src={brand.image}
                              alt={brand.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-contain"
                            />
                          </div>

                          <div className="mt-4 text-center">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-1">
                              <span className="sm:hidden">{brand.name}</span>
                              <span className="hidden sm:inline">Підкрилки для {brand.name}</span>
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              Перейти →
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {!loading && (
              <div className="mt-6 flex justify-start sm:justify-center">
                <LoadMoreButton onClick={onLoadMore} disabled={!canLoadMore}>
                  {canLoadMore ? 'Показати ще' : 'Усі бренди показані'}
                </LoadMoreButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
