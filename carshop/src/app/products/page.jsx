"use client";

import { useEffect, useState } from "react";
import ProductFilters from "@/components/ProductFilters";

export default function ProductsPage() 
{
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
  });

  useEffect(() => 
  {
    const query = new URLSearchParams();

    if (filters.brand) query.append("brand", filters.brand);
    if (filters.model) query.append("model", filters.model);

    fetch(`/api/products?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [filters]);

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold mb-6">Усі підкрилки</h2>

      <ProductFilters onChange={setFilters} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => 
        (
          <div
            key={product.id}
            className="border rounded-lg shadow p-4 text-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain mb-2"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm">
              Пара: {product.price_pair} грн <br />
              Комплект: {product.price_set} грн
            </p>
          </div>
        ))}

        {products.length === 0 && 
        (
          <p className="text-gray-500">Немає результатів за фільтром.</p>
        )}
      </div>
    </section>
  );
}
