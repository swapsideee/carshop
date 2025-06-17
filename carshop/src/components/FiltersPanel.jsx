export default function FiltersPanel({
  query,
  setQuery,
  sort,
  setSort,
  selectedBrand,
  setSelectedBrand,
  brands,
  resetFilters,
}) {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-gray-50 p-6 rounded-2xl shadow-xl space-y-5 h-fit cursor-default">
      <h2 className="text-xl font-bold text-gray-900">Фільтри</h2>

      <div>
        <label className="block mb-1 text-sm text-gray-700 font-medium">
          Пошук
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введіть назву або модель"
          className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-700 font-medium">
          Сортування
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="cursor-pointer w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        >
          <option value="">Обрати</option>
          <option value="asc">Від дешевих до дорогих</option>
          <option value="desc">Від дорогих до дешевих</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-700 font-medium">
          Бренд
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="cursor-pointer w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        >
          <option value="">Усі бренди</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="cursor-pointer w-full bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 px-4 py-2 rounded-md transition"
      >
        Скинути фільтри
      </button>
    </aside>
  );
}
