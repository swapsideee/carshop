import { Suspense } from 'react';

import ProductsCatalogPage from '@/widgets/products-catalog/ui/ProductsCatalogPage';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen px-4 py-10">Завантаження…</div>}>
      <ProductsCatalogPage />
    </Suspense>
  );
}
