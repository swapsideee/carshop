'use client';

import { X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-800 shadow-sm">
      <span className="truncate">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        aria-label="Remove filter"
      >
        <X className="h-4 w-4" />
      </button>
    </span>
  );
}

export default function FiltersPanel({
  query,
  setQuery,
  sort,
  setSort,
  selectedBrand,
  setSelectedBrand,
  brands,
  resetFilters,
  total = 0,
  shown = 0,
  page = 1,
}) {
  const inputKey = useMemo(() => `${query ?? ''}`, [query]);
  const timerRef = useRef(null);

  const sortLabel =
    sort === 'asc' ? 'Від дешевих до дорогих' : sort === 'desc' ? 'Від дорогих до дешевих' : '';

  const brandName = useMemo(() => {
    if (!selectedBrand) return '';
    const b = brands.find((x) => x.slug === selectedBrand);
    return b?.name ?? selectedBrand;
  }, [brands, selectedBrand]);

  const hasAny = Boolean((query && query.trim()) || selectedBrand || sort);

  const scheduleQuery = (val) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setQuery(val), 350);
  };

  const flushQuery = (val) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setQuery(val);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex justify-center w-full">
      <aside
        className="
          w-full md:w-130 lg:w-100 xl:w-125
          bg-white p-6 rounded-xl h-fit mx-auto
          border border-gray-300 shadow-sm
        "
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="hidden md:block text-center text-2xl font-semibold text-gray-900">
            Фільтри
          </h2>

          <div className="ml-auto text-right">
            <div className="text-sm font-semibold text-gray-900">
              {total > 0 ? `Знайдено: ${total}` : 'Знайдено: —'}
            </div>
            <div className="text-xs text-gray-600">
              {total > 0 ? `Показано: ${shown} (стор. ${page})` : ''}
            </div>
          </div>
        </div>

        {hasAny && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {query?.trim() ? (
                <Chip onRemove={() => setQuery('')}>{`Пошук: ${query.trim()}`}</Chip>
              ) : null}

              {selectedBrand ? (
                <Chip onRemove={() => setSelectedBrand('')}>{`Марка: ${brandName}`}</Chip>
              ) : null}

              {sort ? <Chip onRemove={() => setSort('')}>{`Сортування: ${sortLabel}`}</Chip> : null}

              <button
                type="button"
                onClick={resetFilters}
                className="
                  ml-auto inline-flex items-center justify-center
                  rounded-full border border-gray-300 bg-gray-100 px-4 py-1 text-sm font-semibold text-gray-800
                  transition hover:bg-gray-200
                "
              >
                Скинути все
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Пошук</label>
            <input
              key={inputKey}
              type="text"
              defaultValue={query ?? ''}
              onChange={(e) => scheduleQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') flushQuery(e.currentTarget.value);
              }}
              placeholder="Введіть назву або модель"
              className="
                w-full px-3 py-2 rounded-md
                border border-gray-300 bg-white text-gray-900
                transition-[border-color,box-shadow] duration-200
                focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300
              "
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Сортування</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="
                w-full px-3 py-2 rounded-md cursor-pointer
                border border-gray-300 bg-white text-gray-900
                transition-[border-color,box-shadow] duration-200
                focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300
              "
            >
              <option value="">За релевантністю</option>
              <option value="asc">Від дешевих до дорогих</option>
              <option value="desc">Від дорогих до дешевих</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Марка</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="
                w-full px-3 py-2 rounded-md cursor-pointer
                border border-gray-300 bg-white text-gray-900
                transition-[border-color,box-shadow] duration-200
                focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300
              "
            >
              <option value="">Усі марки</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="
              w-full py-2 px-4 rounded-md
              border border-gray-300 bg-gray-100 text-gray-700 font-semibold
              transition-colors duration-200
              hover:bg-gray-200
            "
          >
            Скинути фільтри
          </button>
        </div>
      </aside>
    </div>
  );
}
