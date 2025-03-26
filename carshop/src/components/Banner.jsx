"use client";

import { useEffect, useState } from "react";

export default function Bunner() 
{
  const [products, setProducts] = useState([]);

  useEffect(() => 
  {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error while loading products:", error));
  }, []);

  return (
    <div className="mt-14 flex justify-center ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-30 max-w-7xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full  object-contain p-4"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-black whitespace-nowrap text-sm font-semibold">
            {product.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

