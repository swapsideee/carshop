export type StripeSessionVerificationPaymentStatus = 'no_payment_required' | 'paid' | 'unpaid';

export type StripeSessionVerificationCartItemApiDTO = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type StripeSessionVerificationApiResult = {
  ok: true;
  paid: boolean;
  id: string;
  currency: string | null;
  payment_status: StripeSessionVerificationPaymentStatus;
  customer_email: string | null;
  customer: {
    name: string;
    phone: string;
    comment: string;
  };
  cartItems: StripeSessionVerificationCartItemApiDTO[];
  total: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStripeSessionVerificationCartItem(
  value: unknown,
): value is StripeSessionVerificationCartItemApiDTO {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.quantity === 'number' &&
    typeof value.price === 'number'
  );
}

function isStripeSessionVerificationPaymentStatus(
  value: unknown,
): value is StripeSessionVerificationPaymentStatus {
  return value === 'no_payment_required' || value === 'paid' || value === 'unpaid';
}

export function isStripeSessionVerificationApiResult(
  value: unknown,
): value is StripeSessionVerificationApiResult {
  if (!isRecord(value) || !isRecord(value.customer) || !Array.isArray(value.cartItems))
    return false;

  return (
    value.ok === true &&
    typeof value.paid === 'boolean' &&
    typeof value.id === 'string' &&
    (typeof value.currency === 'string' || value.currency === null) &&
    isStripeSessionVerificationPaymentStatus(value.payment_status) &&
    (typeof value.customer_email === 'string' || value.customer_email === null) &&
    typeof value.customer.name === 'string' &&
    typeof value.customer.phone === 'string' &&
    typeof value.customer.comment === 'string' &&
    value.cartItems.every(isStripeSessionVerificationCartItem) &&
    typeof value.total === 'number'
  );
}
