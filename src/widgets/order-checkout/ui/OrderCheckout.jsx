'use client';

import { useCheckout } from '@/features/order/checkout';

import CheckoutForm from './CheckoutForm';
import CheckoutSuccess from './CheckoutSuccess';

export default function OrderCheckout() {
  const { cartItems, total, form, onChange, submit, isSubmitting, submittedOrder } = useCheckout();

  const onSubmit = async (e) => {
    const res = await submit(e);
    if (!res?.ok) alert(res?.message || 'Помилка');
  };

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
