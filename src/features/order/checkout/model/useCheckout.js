'use client';

import { useMemo, useState } from 'react';

import { useCartStore } from '@/features/cart';

import { validateOrderForm } from '../lib/validation';

export function useCheckout() {
  const { cartItems, clearCart, saveOrder } = useCartStore();

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const [form, setForm] = useState({ name: '', phone: '', email: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const submitted = Boolean(submittedOrder);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault?.();

    const v = validateOrderForm(form);
    if (!v.ok) return { ok: false, message: v.error };

    setIsSubmitting(true);

    const orderData = {
      items: cartItems,
      total,
      name: v.cleaned.name,
      phone: v.cleaned.phone,
      email: v.cleaned.email,
      comment: v.cleaned.comment,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orderData.name,
          phone: orderData.phone,
          email: orderData.email,
          comment: orderData.comment,
          cartItems,
          total,
        }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok || !result?.success) {
        throw new Error(result?.error || 'Сталася помилка під час надсилання листа.');
      }

      saveOrder(orderData);
      clearCart();
      setSubmittedOrder(orderData);

      return { ok: true, order: orderData };
    } catch (err) {
      console.error('Помилка:', err);
      return { ok: false, message: 'Сталася помилка при оформленні замовлення. Спробуйте ще раз.' };
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
    submitted,
    submittedOrder,

    submit,
  };
}
