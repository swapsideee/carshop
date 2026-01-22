'use client';

import { useMemo, useState } from 'react';

import { useCartStore } from '@/features/cart';

import { validateOrderForm } from '../lib/validation';

export function useCheckout() {
  const { cartItems } = useCartStore();

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const [form, setForm] = useState({ name: '', phone: '', email: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault?.();

    const v = validateOrderForm(form);
    if (!v.ok) return { ok: false, message: v.error };

    if (!cartItems?.length) return { ok: false, message: 'Кошик порожній' };

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: v.cleaned.name,
            phone: v.cleaned.phone,
            email: v.cleaned.email,
            comment: v.cleaned.comment,
          },
          cartItems,
          total,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.url) {
        throw new Error(data?.message || 'Не вдалося створити Stripe Checkout сесію');
      }

      window.location.href = data.url;

      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false, message: 'Не вдалося перейти до оплати. Спробуйте ще раз.' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    cartItems,
    total,
    form,
    onChange,
    isSubmitting,
    submit,
  };
}
