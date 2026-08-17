import type Stripe from 'stripe';

import type { CheckoutProduct } from '@/entities/product/server';
import { HttpError } from '@/shared/lib';

import type { CheckoutCartItem } from './schemas';

const OPTION_LABELS = {
  pair: 'Пара',
  set: 'Комплект',
} as const;

function priceToMinorUnits(price: number): number {
  const amount = Math.round(price * 100);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new HttpError(400, 'Для товару вказана некоректна ціна');
  }

  return amount;
}

function getProductName(product: CheckoutProduct, option: CheckoutCartItem['option']): string {
  const title = product.model || product.name || `Товар #${product.id}`;
  return `${title} (${OPTION_LABELS[option]})`;
}

function getOptionPrice(product: CheckoutProduct, option: CheckoutCartItem['option']): number {
  const price = option === 'pair' ? product.price_pair : product.price_set;

  if (price == null || !Number.isFinite(price) || price <= 0) {
    throw new HttpError(400, 'Обраний варіант товару недоступний');
  }

  return price;
}

export function cartItemsToLineItems(
  cartItems: CheckoutCartItem[],
  products: CheckoutProduct[],
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const productsById = new Map(products.map((product) => [product.id, product]));

  return cartItems.map((item) => {
    const product = productsById.get(item.productId);
    if (!product) {
      throw new HttpError(400, 'Один або кілька товарів більше недоступні');
    }

    return {
      quantity: item.quantity,
      price_data: {
        currency: 'uah',
        unit_amount: priceToMinorUnits(getOptionPrice(product, item.option)),
        product_data: { name: getProductName(product, item.option) },
      },
    };
  });
}

export function sessionToCartItems(session: Stripe.Checkout.Session) {
  const lineItems = session.line_items?.data || [];

  return lineItems.map((lineItem, index) => {
    const quantity = lineItem.quantity || 1;
    const unitAmount = lineItem.price?.unit_amount ?? 0;
    const id = lineItem.price?.id || lineItem.id || `li_${session.id}_${index}`;

    return {
      id,
      name: lineItem.description || 'Товар',
      quantity,
      price: Number((unitAmount / 100).toFixed(2)),
    };
  });
}

export function sessionToTotal(session: Stripe.Checkout.Session): number {
  return Number(((session.amount_total || 0) / 100).toFixed(2));
}

export function sessionToEmailPayload(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.customer_email || '';
  const name = session.metadata?.name || session.customer_details?.name || '';
  const phone = session.metadata?.phone || '';
  const comment = session.metadata?.comment || '';

  return {
    name,
    phone,
    email,
    comment,
    cartItems: sessionToCartItems(session).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: sessionToTotal(session),
  };
}

export function sessionToClientVerification(session: Stripe.Checkout.Session) {
  return {
    paid: session.payment_status === 'paid',
    id: session.id,
    currency: session.currency,
    payment_status: session.payment_status,
    customer_email: session.customer_details?.email || session.customer_email || null,
    metadata: session.metadata || {},
    cartItems: sessionToCartItems(session),
    total: sessionToTotal(session),
  };
}
