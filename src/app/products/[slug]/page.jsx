'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { isProductSlug } from '@/entities/product/model/selectors';
import BrandProductsPage from '@/widgets/brand-products/ui/BrandProductsPage';
import ProductPage from '@/widgets/product-page/ui/ProductPage';

export default function ProductOrBrandPage() {
  const params = useParams();
  const slug = params?.slug;

  const isProductId = useMemo(() => isProductSlug(slug), [slug]);

  if (!slug) return null;

  return isProductId ? (
    <ProductPage productId={Number(slug)} />
  ) : (
    <BrandProductsPage brand={slug} />
  );
}
