import { describe, expect, it } from 'vitest';

import type { BrandRow } from '@/shared/db/schema';

import { mapBrandRow } from '../mappers';

describe('brand database mapper', () => {
  it('preserves nullable columns in the domain DTO', () => {
    expect(mapBrandRow({ id: 33, name: 'Saipa', slug: 'saipa', image: null } as BrandRow)).toEqual({
      id: 33,
      name: 'Saipa',
      slug: 'saipa',
      image: null,
    });
  });
});
