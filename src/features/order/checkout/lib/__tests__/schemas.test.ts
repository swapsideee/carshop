import { describe, expect, it } from 'vitest';

import { HttpError } from '@/shared/lib';

import { getUniqueCheckoutProductIds, parseCheckoutRequest } from '../schemas';

const validRequest = {
  customer: {
    name: 'Ivan Petrenko',
    phone: '+380501234567',
    email: 'ivan@example.com',
    comment: 'Call before delivery',
  },
  cartItems: [{ productId: 42, option: 'pair', quantity: 2 }],
};

describe('parseCheckoutRequest', () => {
  it('accepts a bounded cart without client-controlled prices', () => {
    expect(parseCheckoutRequest(validRequest)).toEqual(validRequest);
  });

  it('rejects a price supplied by the client', () => {
    expect(() =>
      parseCheckoutRequest({
        ...validRequest,
        cartItems: [{ ...validRequest.cartItems[0], price: 1 }],
      }),
    ).toThrow(HttpError);
  });

  it('rejects duplicate product options and invalid quantities', () => {
    expect(() =>
      parseCheckoutRequest({
        ...validRequest,
        cartItems: [validRequest.cartItems[0], { productId: 42, option: 'pair', quantity: 1 }],
      }),
    ).toThrow(HttpError);

    expect(() =>
      parseCheckoutRequest({
        ...validRequest,
        cartItems: [{ productId: 42, option: 'pair', quantity: 11 }],
      }),
    ).toThrow(HttpError);
  });

  it('keeps pair and set of the same product as distinct cart lines while querying one product', () => {
    const request = parseCheckoutRequest({
      ...validRequest,
      cartItems: [
        { productId: 42, option: 'pair', quantity: 1 },
        { productId: 42, option: 'set', quantity: 1 },
      ],
    });

    expect(request.cartItems).toHaveLength(2);
    expect(getUniqueCheckoutProductIds(request.cartItems)).toEqual([42]);
  });
});
