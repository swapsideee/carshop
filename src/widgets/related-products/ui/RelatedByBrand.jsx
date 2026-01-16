'use client';

import { useRelatedByBrand } from '../model/useRelatedByBrand';
import RelatedRow from './RelatedRow';

export default function RelatedByBrand({ product }) {
  const { items, loading } = useRelatedByBrand(product);

  if (!loading && (!Array.isArray(items) || items.length === 0)) return null;

  return <RelatedRow title="Схожі товари" items={items} loading={loading} />;
}
