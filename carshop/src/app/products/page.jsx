"use client";

import { useEffect, useState } from "react";
import { normalize } from "@/lib/normalize";
import FiltersPanel from "@/components/FiltersPanel";
import ProductCard from "@/components/ProductCard";

export default function AllProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sort, setSort] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, brandsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/brands"),
        ]);
        const [products, brands] = await Promise.all([
          productsRes.json(),
          brandsRes.json(),
        ]);

        setAllProducts(products);
        setFilteredProducts(products);
        setBrands(brands);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedBrand)
      filtered = filtered.filter((p) => p.brand_slug === selectedBrand);

    if (query.trim()) {
      const terms = normalize(query).split(/\s+/);
      filtered = filtered.filter((p) => {
        const raw = `${p.name} ${p.model}`.toLowerCase();
        const norm = normalize(raw);
        return terms.every((word) => raw.includes(word) || norm.includes(word));
      });
    }

    if (sort === "asc")
      filtered.sort((a, b) => (a.price_pair || 0) - (b.price_pair || 0));
    else if (sort === "desc")
      filtered.sort((a, b) => (b.price_pair || 0) - (a.price_pair || 0));

    setFilteredProducts(filtered);
  }, [selectedBrand, sort, query, allProducts]);

  const resetFilters = () => {
    setSelectedBrand("");
    setSort("");
    setQuery("");
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8 py-10">
      <div className="w-full lg:w-[275px] shrink-0">
        <FiltersPanel
          brands={brands}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          sort={sort}
          setSort={setSort}
          query={query}
          setQuery={setQuery}
          resetFilters={resetFilters}
        />
      </div>

      <div className="w-full bg-zinc-50 rounded-2xl shadow-md">
        <main className="p-4">
          {isLoading ? (
            <div className="text-center text-gray-500 mt-20 text-lg animate-pulse">
              Завантаження товарів...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center mt-20 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M9.75 9.75h.008v.008H9.75v-.008zm4.5 0h.008v.008h-.008v-.008zM9.88 15.38a4.501 4.501 0 004.24 0"
                />
              </svg>
              <p className="text-lg">
                Не знайдено товарів за вибраними фільтрами.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  clickable={true}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
