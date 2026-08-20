import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { type SaveOrderInput, useCartStore } from '@/features/cart';
import {
  getStripeSessionVerification,
  useCheckout,
  type UseCheckoutResult,
} from '@/features/order/checkout';

type StripeReturn = {
  payment: string | null;
  sessionId: string | null;
};

export type UseOrderCheckoutResult = Pick<
  UseCheckoutResult,
  'cartItems' | 'total' | 'form' | 'onChange' | 'isSubmitting'
> & {
  verifying: boolean;
  submittedOrder: SaveOrderInput | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function useOrderCheckout(): UseOrderCheckoutResult {
  const { cartItems, total, form, onChange, submit, isSubmitting } = useCheckout();
  const { clearCart, saveOrder } = useCartStore();

  const [submittedOrder, setSubmittedOrder] = useState<SaveOrderInput | null>(null);
  const [verifying, setVerifying] = useState(false);

  const stripeReturn = useMemo<StripeReturn>(() => {
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

    void (async () => {
      try {
        setVerifying(true);

        const data = await getStripeSessionVerification(sessionId);

        if (!data.paid) {
          alert('Оплата не підтверджена. Якщо гроші списались — зверніться до менеджера.');
          return;
        }

        const orderData: SaveOrderInput = {
          items: data.cartItems || [],
          total: data.total ?? 0,
          name: data.customer?.name || '',
          phone: data.customer?.phone || '',
          email: data.customer_email || '',
          comment: data.customer?.comment || '',
          createdAt: new Date().toISOString(),
          paid: true,
          stripeSessionId: data.id,
        };

        if (cancelled) return;

        saveOrder(orderData);
        clearCart();
        setSubmittedOrder(orderData);

        window.history.replaceState({}, '', '/order');
      } catch (error: unknown) {
        console.error(error);
        alert('Не вдалося підтвердити оплату. Спробуйте оновити сторінку.');
      } finally {
        if (!cancelled) setVerifying(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stripeReturn, clearCart, saveOrder]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    const result = await submit(event);
    if (!result.ok) alert(result.message || 'Помилка');
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
