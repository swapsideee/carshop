'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentBanner() {
  const sp = useSearchParams();
  const payment = sp.get('payment');

  if (!payment) return null;

  if (payment === 'success') {
    return (
      <div className="mx-auto max-w-2xl mt-6 mb-2 px-4">
        <div className="rounded-xl bg-lime-100 text-lime-900 p-4">
          ✅ Оплата пройшла (test). Дякуємо!
        </div>
      </div>
    );
  }

  if (payment === 'cancel') {
    return (
      <div className="mx-auto max-w-2xl mt-6 mb-2 px-4">
        <div className="rounded-xl bg-yellow-100 text-yellow-900 p-4">
          ⚠️ Оплату скасовано. Ви можете спробувати ще раз.
        </div>
      </div>
    );
  }

  return null;
}
