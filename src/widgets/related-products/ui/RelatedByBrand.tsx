'use client';

import { type ProductDetailApiDTO } from '@/entities/product';

import { useRelatedByBrand } from '../model/useRelatedByBrand';
import RelatedRow from './RelatedRow';

type RelatedByBrandProps = {
  product: ProductDetailApiDTO;
};

export default function RelatedByBrand({ product }: RelatedByBrandProps) {
  const { items, loading } = useRelatedByBrand(product);

  if (!loading && (!Array.isArray(items) || items.length === 0)) return null;

  return <RelatedRow title="Схожі товари" items={items} loading={loading} />;
}
