'use client';

import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Banner() {
  const [brands, setBrands] = useState([]);
  const controls = useAnimationControls();
  const reqIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const myReqId = ++reqIdRef.current;

    const loadBrands = async () => {
      try {
        const res = await fetch('/api/brands', {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`Failed to load brands: ${res.status}`);

        const data = await res.json();

        if (myReqId !== reqIdRef.current) return;

        const safe = Array.isArray(data) ? data : [];
        setBrands(safe);

        requestAnimationFrame(() => {
          controls.start('visible');
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('Error loading brands:', err);

        if (myReqId === reqIdRef.current) {
          setBrands([]);
        }
      }
    };

    controls.set('hidden');
    loadBrands();

    return () => controller.abort();
  }, [controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="mt-14 flex justify-center px-4 sm:px-6 lg:px-8 cursor-default">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl w-full gap-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {brands.map((brand) => (
          <motion.div
            key={brand.id}
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="group relative w-full aspect-square overflow-hidden bg-white border border-gray-200 rounded-xl transition-all hover:shadow-md duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            <Link href={`/products/${brand.slug}`} className="block w-full h-full">
              <div className="w-full h-full flex flex-col items-center justify-center p-6">
                <div className="relative w-full h-[70%]">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain transition-transform duration-300"
                  />
                </div>

                <div className="mt-4 text-center">
                  <h3 className="block sm:hidden text-md font-semibold text-gray-900 mb-1">
                    {brand.name}
                  </h3>
                  <h3 className="hidden sm:block text-md font-semibold text-gray-900 mb-1">
                    Підкрилки для {brand.name}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
