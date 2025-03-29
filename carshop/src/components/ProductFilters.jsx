"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProductFilters({ onChange, initialBrand }) 
{
  const router = useRouter();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [filters, setFilters] = useState({
    brand: initialBrand || "",
    model: "",
  });

  useEffect(() => 
  {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data));
  }, []);

  useEffect(() => 
  {
    if (filters.brand) 
    {
      fetch(`/api/models?brand=${filters.brand}`)
        .then((res) => res.json())
        .then((data) => setModels(data));
    } 
    else 
    {
      setModels([]);
    }
  }, [filters.brand]);

  const handleChange = (e) => 
  {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onChange(newFilters);

    if (name === 'brand') {
      if (value) {
        router.push(`/products/${value}`);
      } else {
        router.push('/products');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Марка автомобіля
          </label>
          <select
            id="brand"
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer hover:border-indigo-300 text-gray-900 font-medium"
          >
            <option value="" className="text-gray-500">Оберіть марку</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug} className="text-gray-900 font-medium">
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            Модель автомобіля
          </label>
          <select
            id="model"
            name="model"
            value={filters.model}
            onChange={handleChange}
            disabled={!filters.brand}
            className={`w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none text-gray-900 font-medium ${
              !filters.brand ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-300'
            }`}
          >
            <option value="" className="text-gray-500">Оберіть модель</option>
            {models.map((model) => (
              <option key={model.model} value={model.model} className="text-gray-900 font-medium">
                {model.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(filters.brand || filters.model) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-indigo-50 rounded-lg p-4 border border-indigo-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-black font-medium">Активні фільтри:</span>
            {filters.brand && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-black border border-indigo-200">
                {brands.find(b => b.slug === filters.brand)?.name}
                <button
                  onClick={() => handleChange({ target: { name: 'brand', value: '' } })}
                  className="ml-2 text-black transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.model && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-black border border-indigo-200">
                {filters.model}
                <button
                  onClick={() => handleChange({ target: { name: 'model', value: '' } })}
                  className="ml-2 text-black transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <button
            onClick={() => handleChange({ target: { name: 'brand', value: '' } })}
            className="text-sm text-black transition-colors duration-200 font-medium"
          >
            Скинути фільтри
          </button>
        </motion.div>
      )}
    </div>
  );
}
