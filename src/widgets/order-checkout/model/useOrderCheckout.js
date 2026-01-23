'use client';

import { useEffect, useMemo, useState } from 'react';

import { useCartStore } from '@/features/cart';
import { useCheckout } from '@/features/order/checkout';

export function useOrderCheckout() {
  const { cartItems, total, form, onChange, submit, isSubmitting } = useCheckout();
  const { clearCart, saveOrder } = useCartStore();

  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const stripeReturn = useMemo(() => {
    if (typeof window === 'undefined') return { payment: null, sessionId: null };
    const params = new URLSearchParams(window.location.search);
    return {
      payment: params.get('payment'),
      sessionId: params.get('session_id'),
    };
  }, []);

  useEffect(() => {
    const { payment, sessionId } = stripeReturn;
    if (payment !== 'success' || !sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        setVerifying(true);

        const res = await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json().catch(() => null);

        if (!res.ok || !data) throw new Error(data?.message || 'Failed to verify payment');

        if (!data.paid) {
          alert('Оплата не підтверджена. Якщо гроші списались — зверніться до менеджера.');
          return;
        }

        const orderData = {
          items: data.cartItems || [],
          total: data.total ?? 0,
          name: data.metadata?.name || '',
          phone: data.metadata?.phone || '',
          email: data.customer_email || '',
          comment: data.metadata?.comment || '',
          createdAt: new Date().toISOString(),
          paid: true,
          stripeSessionId: data.id,
        };

        if (cancelled) return;

        saveOrder(orderData);

        clearCart();

        setSubmittedOrder(orderData);

        window.history.replaceState({}, '', '/order');
      } catch (e) {
        console.error(e);
        alert('Не вдалося підтвердити оплату. Спробуйте оновити сторінку.');
      } finally {
        if (!cancelled) setVerifying(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stripeReturn, clearCart, saveOrder]);

  const onSubmit = async (e) => {
    const res = await submit(e);
    if (!res?.ok) alert(res?.message || 'Помилка');
  };

  return {
    cartItems,
    total,
    form,
    onChange,
    isSubmitting,

    verifying,
    submittedOrder,

    onSubmit,
  };
}
