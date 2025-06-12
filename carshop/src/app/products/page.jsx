"use client";

import { useEffect, useState } from "react";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sort, setSort] = useState("asc");

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then(setBrands);
  }, []);

  useEffect(() => {
    let url = `/api/products/all?sort=${sort}`;
    if (selectedBrand) url += `&brand=${selectedBrand}`;
    fetch(url)
      .then((res) => res.json())
      .then(setProducts);
  }, [sort, selectedBrand]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="asc">Від дешевих до дорогих</option>
          <option value="desc">Від дорогих до дешевих</option>
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Усі бренди</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center" // Consider a different approach
          >
            <div className="w-full h-40 flex items-center justify-center mb-4">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="max-h-full object-contain"
              />
            </div>
            <p className="font-semibold text-lg">{product.model}</p>
            <p className="text-sm text-gray-600">{product.name}</p>
            <p className="mt-2 text-sm">
              Пара: {product.price_pair ?? "—"} грн
            </p>
            <p className="text-sm">Комплект: {product.price_set ?? "—"} грн</p>
          </div>
        ))}
      </div>
    </div>
  );
}
