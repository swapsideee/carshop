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
    <div className="flex justify-center w-full">
      <aside className="w-full md:w-130 lg:w-[400px] xl:w-[500px] bg-gray-100 p-6 rounded-2xl shadow-2xl space-y-5 h-fit cursor-default mx-auto">
        <h2 className="text-center text-2xl font-bold text-gray-900">Фільтри</h2>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">
            Пошук
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введіть назву або модель"
            className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-lime-600 shadow-sm transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">
            Сортування
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cursor-pointer w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-lime-600 shadow-sm transition"
          >
            <option value="">За релевантнiстю</option>
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
            className="cursor-pointer w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-lime-600 shadow-sm transition"
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
    </div>
  );
}
