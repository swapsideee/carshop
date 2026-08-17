import { describe, expect, it } from 'vitest';

import type { CheckoutProduct } from '@/entities/product/server';
import { HttpError } from '@/shared/lib';

import { cartItemsToLineItems } from '../stripeMappers';

const product: CheckoutProduct = {
  id: 42,
  name: 'Brake pads',
  model: 'Model X',
  price_pair: 1250,
  price_set: 2400,
};

describe('cartItemsToLineItems', () => {
  it('uses the price resolved from the server product', () => {
    const [lineItem] = cartItemsToLineItems(
      [{ productId: 42, option: 'pair', quantity: 2 }],
      [product],
    );

    expect(lineItem?.quantity).toBe(2);
    expect(lineItem?.price_data?.unit_amount).toBe(125000);
    expect(lineItem?.price_data?.product_data?.name).toBe('Model X (Пара)');
  });

  it('rejects unavailable options and products', () => {
    expect(() =>
      cartItemsToLineItems(
        [{ productId: 42, option: 'set', quantity: 1 }],
        [{ ...product, price_set: null }],
      ),
    ).toThrow(HttpError);

    expect(() =>
      cartItemsToLineItems([{ productId: 99, option: 'pair', quantity: 1 }], [product]),
    ).toThrow(HttpError);
  });
});
