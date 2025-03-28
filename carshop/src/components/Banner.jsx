"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Banner() 
{
  const [brands, setBrands] = useState([]);

  useEffect(() => 
  {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((error) => console.error("Error while loading brands:", error));
  }, []);

  return (
    <div className="mt-14 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-30 max-w-7xl">
        {brands.map((brand, index) => (
          <Link key={brand.id} href={`/products/${brand.slug}`}>
            <motion.div
              className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex items-center justify-center bg-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={brand.image}
                alt={brand.slug}
                className="max-h-[75%] max-w-[75%] object-contain"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-black whitespace-nowrap text-sm font-semibold text-center">
                Підкрилки для автомобілей марки <br /> {brand.name}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
