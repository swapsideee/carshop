"use client";

import { useEffect, useState } from "react";

export default function ProductFilters({ onChange }) 
{
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
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
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <select
        name="brand"
        value={filters.brand}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Марка</option>
        {brands.map((brand) => 
        (
          <option key={brand.id} value={brand.slug}>
            {brand.name}
          </option>
        ))}
      </select>

      <select
        name="model"
        value={filters.model}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Модель</option>
        {models.map((model) => 
        (
          <option key={model.model} value={model.model}>
            {model.model}
          </option>
        ))}
      </select>
    </div>
  );
}
