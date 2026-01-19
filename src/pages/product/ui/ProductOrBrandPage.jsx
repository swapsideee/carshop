'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { useProduct } from '@/entities/product';
import { isProductSlug } from '@/entities/product';
import { ReviewsSection } from '@/features/reviews/product-reviews';
import BrandProducts from '@/widgets/brand-products';
import DescriptionBlock from '@/widgets/product-description';
import ProductDetails from '@/widgets/product-details';
import RelatedByBrand from '@/widgets/related-products';

function ProductView({ productId }) {
  const { product, loading } = useProduct(productId);

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

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-20 text-center text-gray-500">
            <h1 className="mb-4 text-2xl font-bold">Товар не знайдено</h1>
            <Link href="/products" className="text-gray-900 hover:underline">
              Повернутися до каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-16 px-4 py-10">
      <ProductDetails product={product} />

      <div className="mx-auto w-full max-w-6xl">
        <DescriptionBlock />
      </div>

      <ReviewsSection productId={productId} />

      <RelatedByBrand product={product} />
    </div>
  );
}

export default function ProductOrBrandPage() {
  const params = useParams();
  const slug = params?.slug;

  const isProductId = useMemo(() => isProductSlug(slug), [slug]);

  if (!slug) return null;

  return isProductId ? <ProductView productId={Number(slug)} /> : <BrandProducts brand={slug} />;
}
