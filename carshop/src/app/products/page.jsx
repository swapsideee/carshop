"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { normalize } from "@/lib/normalize";
import FiltersPanel from "@/components/FiltersPanel";
import ProductCard from "@/components/ProductCard";
import { Funnel } from "lucide-react";

export default function AllProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sort, setSort] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 gap-8 py-10 h-full min-h-screen">
      <div className="hidden md:block w-72 shrink-0 h-full">
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

      <div className="md:hidden w-full mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
        >
          {showMobileFilters ? "Фільтри" : "Фільтри"}
          <Funnel className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 rounded-xl">
        <main>
          {isLoading ? (
            <div className="text-center text-gray-500 mt-20 text-lg animate-pulse">
              Завантаження товарів...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center mt-20 text-gray-500"></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
