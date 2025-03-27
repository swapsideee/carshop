"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Banner() 
{
  const [brands, setBrands] = useState([]);

  useEffect(() => 
  {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((error) =>
        console.error("Error while loading brands:", error)
      );
  }, []);

  return (
    <div className="mt-14 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-30 max-w-7xl">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/products/${brand.slug}`}>
            <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer">
              <img
                src={brand.image}
                alt={brand.slug}
                className="w-full h-full object-contain p-4"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-black whitespace-nowrap text-sm font-semibold">
                {brand.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
