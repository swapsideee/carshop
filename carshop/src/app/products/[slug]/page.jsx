"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";

export default function ProductOrBrandPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [brandProducts, setBrandProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isProductId = !isNaN(Number(params.slug));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (isProductId) {
          const response = await fetch(`/api/products/${params.slug}`);
          const data = await response.json();
          setProduct(data);
        } else {
          const response = await fetch(`/api/products?brand=${params.slug}`);
          const data = await response.json();
          setBrandProducts(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.slug, isProductId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500 mt-20 text-lg animate-pulse">
            Завантаження...
          </div>
        </div>
      </div>
    );
  }

  if (!isProductId) {
    return (
      <div className="min-h-screen bg-zinc-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6 text-black uppercase">
            {params.slug}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {brandProducts.length === 0 ? (
              <div className="text-gray-500">
                Товарів цього бренду не знайдено.
              </div>
            ) : (
              brandProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} clickable={false} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500 mt-20">
            <h1 className="text-2xl font-bold mb-4">Товар не знайдено</h1>
            <Link href="/products" className="text-blue-500 hover:underline">
              Повернутися до каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="flex items-center justify-center">
            <ProductGallery
              images={[product.image, product.image2].filter(Boolean)}
            />
          </div>

          <div>
            <p className="text-sm text-gray-600">Ціна за комплект: </p>
            <p className="text-xl font-semibold">
              {product.price_set !== null ? (
                <span className="text-black">{product.price_set} грн</span>
              ) : (
                <span className="text-lime-600">За запитом</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("test button")}
            className="bg-blue-700 hover:bg-blue-600 text-white text-sm md:text-base py-3 px-4 md:py-4 md:px-6 rounded-2xl shadow-md font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            Оформити замовлення
          </button>
        </div>
      </div>
    </div>
  );
}
