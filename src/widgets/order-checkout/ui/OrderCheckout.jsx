'use client';

import { useOrderCheckout } from '../model/useOrderCheckout';
import CheckoutForm from './CheckoutForm';
import CheckoutSuccess from './CheckoutSuccess';

export default function OrderCheckout() {
  const { cartItems, total, form, onChange, isSubmitting, verifying, submittedOrder, onSubmit } =
    useOrderCheckout();

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 text-center space-y-3">
          <div className="text-2xl font-bold text-gray-900">Підтверджуємо оплату…</div>
          <div className="text-gray-600 text-sm">
            Це займає кілька секунд. Не закривайте сторінку.
          </div>
        </div>
      </div>
    );
  }

  if (submittedOrder) return <CheckoutSuccess order={submittedOrder} />;

  return (
    <CheckoutForm
      cartItems={cartItems}
      total={total}
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
