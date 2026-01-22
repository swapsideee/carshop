import { HttpError } from '@/shared/lib';

export function cartItemsToLineItems(cartItems, currency = 'uah') {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new HttpError(400, 'Кошик порожній');
  }

  return cartItems.map((item) => {
    const name = String(item?.name || 'Товар');
    const quantity = Number(item?.quantity || 1);
    const price = Number(item?.price || 0);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new HttpError(400, `Некоректна кількість товару: ${name}`);
    }
    if (!Number.isFinite(price) || price <= 0) {
      throw new HttpError(400, `Некоректна ціна товару: ${name}`);
    }

    const unit_amount = Math.round(price * 100);

    return {
      quantity,
      price_data: {
        currency,
        unit_amount,
        product_data: { name },
      },
    };
  });
}

export function sessionToCartItems(session) {
  const lineItems = session?.line_items?.data || [];

  return lineItems.map((li, idx) => {
    const qty = li.quantity || 1;
    const unitAmount = li.price?.unit_amount ?? 0;

    const id = li.price?.id || li.id || `li_${session.id}_${idx}`;

    return {
      id,
      name: li.description || 'Товар',
      quantity: qty,
      price: Number((unitAmount / 100).toFixed(2)),
    };
  });
}

export function sessionToTotal(session) {
  return Number(((session?.amount_total || 0) / 100).toFixed(2));
}

export function sessionToEmailPayload(session) {
  const email = session.customer_details?.email || session.customer_email || '';
  const name = session.metadata?.name || session.customer_details?.name || '';
  const phone = session.metadata?.phone || '';
  const comment = session.metadata?.comment || '';

  return {
    name,
    phone,
    email,
    comment,
    cartItems: sessionToCartItems(session).map(({ id, ...rest }) => rest),
    total: sessionToTotal(session),
  };
}

export function sessionToClientVerification(session) {
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
