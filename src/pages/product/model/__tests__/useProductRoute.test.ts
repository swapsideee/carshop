import { describe, expect, it } from 'vitest';

import { parseProductRoute } from '../useProductRoute';

describe('parseProductRoute', () => {
  it('returns empty for a missing or invalid numeric product slug', () => {
    expect(parseProductRoute()).toEqual({ kind: 'empty' });
    expect(parseProductRoute('')).toEqual({ kind: 'empty' });
    expect(parseProductRoute('0')).toEqual({ kind: 'empty' });
    expect(parseProductRoute('-1')).toEqual({ kind: 'empty' });
    expect(parseProductRoute('Infinity')).toEqual({ kind: 'empty' });
  });

  it('returns a product route for a valid numeric slug', () => {
    expect(parseProductRoute('123')).toEqual({ kind: 'product', id: 123 });
  });

  it('returns a brand route for a non-numeric slug', () => {
    expect(parseProductRoute('audi')).toEqual({ kind: 'brand', brand: 'audi' });
  });
});
