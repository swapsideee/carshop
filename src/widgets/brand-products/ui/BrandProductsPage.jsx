'use client';

import ProductCard from '@/entities/product/ui/ProductCard/ProductCard';

import { useBrandProducts } from '../model/useBrandProducts';

export default function BrandProductsPage({ brand }) {
  const brandName = String(brand || '').toUpperCase();
  const { items, loading } = useBrandProducts(brand);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-20 animate-pulse text-center text-lg text-gray-900">
            Завантаження...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-extrabold tracking-wide text-gray-900 sm:text-5xl">
          Підкрилки для бренду <span className="uppercase">{brandName}</span>
        </h1>

        <div className="mt-10">
          {items.length === 0 ? (
            <div className="text-center text-sm text-gray-900">
              Товарів цього бренду не знайдено.
            </div>
          ) : (
            <div className="mx-auto w-full max-w-6xl">
              <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <div key={p.id} className="w-full">
                    <ProductCard product={p} clickable />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
