import { describe, expect, it } from 'vitest';

import { isProductListSortApiValue, normalizeProductListSortApiValue } from '../apiTypes';

describe('product list sort API contract', () => {
  it.each(['', 'asc', 'desc'])('accepts the supported wire value %j', (value) => {
    expect(isProductListSortApiValue(value)).toBe(true);
  });

  it.each(['ASC', 'price_pair', 'ascending', '0'])(
    'rejects an unsupported wire value %j',
    (value) => {
      expect(isProductListSortApiValue(value)).toBe(false);
    },
  );

  it.each([
    ['', ''],
    ['asc', 'asc'],
    ['desc', 'desc'],
    ['ASC', ''],
    ['price_pair', ''],
  ] as const)('normalizes %j to %j', (value, normalizedValue) => {
    expect(normalizeProductListSortApiValue(value)).toBe(normalizedValue);
  });
});
