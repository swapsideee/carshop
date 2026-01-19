import { Suspense } from 'react';

import ProductsCatalog from '@/widgets/products-catalog';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen px-4 py-10">Завантаження…</div>}>
      <ProductsCatalog />
    </Suspense>
  );
}
