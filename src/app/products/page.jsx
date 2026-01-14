import { Suspense } from 'react';

import ProductsClient from './ProductsClient';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen px-4 py-10">Завантаження…</div>}>
      <ProductsClient />
    </Suspense>
  );
}
