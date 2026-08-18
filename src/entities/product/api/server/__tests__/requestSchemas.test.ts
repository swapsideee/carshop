import { describe, expect, it } from 'vitest';

import { HttpError } from '@/shared/lib';

import { parseProductId, parseProductsRequest } from '../requestSchemas';

describe('product request schemas', () => {
  it('normalizes a paged catalogue request into repository arguments', () => {
    expect(
      parseProductsRequest(
        new URLSearchParams({
          brand: ' saipa ',
          q: '  Tiba  ',
          page: '2',
          limit: '60',
          sort: 'desc',
          sort_by: 'model',
        }),
      ),
    ).toEqual({
      kind: 'paged',
      brand: 'saipa',
      q: 'Tiba',
      page: 2,
      limit: 60,
      sortBy: 'model',
      sortOrder: 'DESC',
    });
  });

  it('keeps the product-select endpoint separate from paged catalogue arguments', () => {
    expect(parseProductsRequest(new URLSearchParams({ forSelect: '1', q: ' Tiba ' }))).toEqual({
      kind: 'select',
      brand: '',
      q: 'Tiba',
    });
  });

  it('rejects invalid path identifiers as a safe client error', () => {
    expect(() => parseProductId('0')).toThrow(HttpError);
    expect(() => parseProductId('0')).toThrow('Invalid product id');
    expect(() => parseProductId('1e2')).toThrow('Invalid product id');
  });
});
