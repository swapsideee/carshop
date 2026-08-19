'use client';

import BrandProducts from '@/widgets/brand-products';
import ProductView from '@/widgets/product-view';

import { useProductRoute } from '../model/useProductRoute';

export default function ProductOrBrandPage() {
  const route = useProductRoute();

  switch (route.kind) {
    case 'empty':
      return null;
    case 'product':
      return <ProductView productId={route.id} />;
    case 'brand':
      return <BrandProducts brand={route.brand} />;
  }
}
