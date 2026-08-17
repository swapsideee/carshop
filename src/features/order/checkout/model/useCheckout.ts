'use client';

import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';

import { type CartItem, type CartOption, useCartStore } from '@/features/cart';

import { createStripeCheckout } from '../api/createStripeCheckout';
import type { CheckoutCartItem } from '../lib/schemas';
import { type CheckoutForm, validateOrderForm } from '../lib/validation';

const LEGACY_CART_ITEM_ID = /^(?<productId>\d+)-(?<option>pair|set)$/;

function toCheckoutCartItem(item: CartItem): CheckoutCartItem | null {
  const productId = Number(item.productId);
  const option = item.option;

  if (Number.isSafeInteger(productId) && productId > 0 && (option === 'pair' || option === 'set')) {
    return { productId, option, quantity: Number(item.quantity) };
  }

  const legacy = LEGACY_CART_ITEM_ID.exec(item.id);
  const legacyProductId = Number(legacy?.groups?.productId);
  const legacyOption = legacy?.groups?.option as CartOption | undefined;

  if (
    Number.isSafeInteger(legacyProductId) &&
    legacyProductId > 0 &&
    (legacyOption === 'pair' || legacyOption === 'set')
  ) {
    return { productId: legacyProductId, option: legacyOption, quantity: Number(item.quantity) };
  }

  return null;
}

export function useCheckout() {
  const { cartItems } = useCartStore();

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 0), 0),
    [cartItems],
  );

  const [form, setForm] = useState<CheckoutForm>({ name: '', phone: '', email: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const submit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const validation = validateOrderForm(form);
    if (!validation.ok) return { ok: false, message: validation.error };

    if (!cartItems.length) return { ok: false, message: 'Кошик порожній' };

    const checkoutCartItems: CheckoutCartItem[] = [];
    for (const item of cartItems) {
      const checkoutItem = toCheckoutCartItem(item);
      if (!checkoutItem) {
        return { ok: false, message: 'Оновіть дані кошика перед оплатою' };
      }
      checkoutCartItems.push(checkoutItem);
    }

    setIsSubmitting(true);

    try {
      const checkout = await createStripeCheckout({
        customer: validation.cleaned,
        cartItems: checkoutCartItems,
      });

      window.location.assign(checkout.url);
      return { ok: true };
    } catch (error: unknown) {
      console.error(error);
      return { ok: false, message: 'Не вдалося перейти до оплати. Спробуйте ще раз.' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { cartItems, total, form, onChange, isSubmitting, submit };
}
