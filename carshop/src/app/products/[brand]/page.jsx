"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProductFilters from "@/components/ProductFilters";

export default function BrandPage({ params }) 
{
  const router = useRouter();
  const brand = use(params).brand;
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: brand,
    model: "",
  });

  useEffect(() => 
  {
    const query = new URLSearchParams();
    if (filters.model) query.append("model", filters.model);

    fetch(`/api/products?brand=${brand}&${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [filters, brand]);

  const handleFilterChange = (newFilters) => 
  {
    setFilters(newFilters);
    
    const query = new URLSearchParams();
    if (newFilters.model) query.append("model", newFilters.model);
    
    const newUrl = `/products/${brand}${query.toString() ? `?${query.toString()}` : ''}`;
    router.push(newUrl);
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">
              Підкрилки для {brand.toUpperCase()}
            </h2>
            <p className="text-black">Виберіть підкрилки для вашого автомобіля</p>
          </div>
          <p className="text-black font-medium">Знайдено {products.length} товарів</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-indigo-100">
          <ProductFilters 
            onChange={handleFilterChange} 
            initialBrand={brand}
          />
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-100"
            >
              <div className="relative aspect-square p-6 bg-indigo-50/50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold black mb-3">{product.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black">Пара:</span>
                    <span className="font-semibold text-black">{product.price_pair} грн</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Комплект: </span>
                    <span className="font-semibold text-black">{product.price_set} грн</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {products.length === 0 && (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-black text-lg font-medium">Немає результатів за фільтром</p>
              <p className="text-black text-sm mt-2">Спробуйте змінити параметри фільтрації</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
