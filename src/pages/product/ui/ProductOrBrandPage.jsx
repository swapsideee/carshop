'use client';

import BrandProducts from '@/widgets/brand-products';
import ProductView from '@/widgets/product-view';

import { useProductRoute } from '../model/useProductRoute';

export default function ProductOrBrandPage() {
  const route = useProductRoute();

  if (route.kind === 'empty') return null;
  if (route.kind === 'product') return <ProductView productId={route.id} />;
  return <BrandProducts brand={route.brand} />;
}
