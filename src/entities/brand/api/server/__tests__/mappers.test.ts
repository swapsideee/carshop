import { describe, expect, it } from 'vitest';

import type { BrandRow } from '@/shared/db/schema';

import { mapBrandRow } from '../mappers';
import { toBrandApiDTO } from '../serializers';

describe('brand database mapper', () => {
  it('preserves nullable columns in the domain DTO', () => {
    expect(mapBrandRow({ id: 33, name: 'Saipa', slug: 'saipa', image: null } as BrandRow)).toEqual({
      id: 33,
      name: 'Saipa',
      slug: 'saipa',
      image: null,
    });
  });

  it('keeps the current brand API wire contract in an explicit serializer', () => {
    expect(toBrandApiDTO({ id: 33, name: 'Saipa', slug: 'saipa', image: null })).toEqual({
      id: 33,
      name: 'Saipa',
      slug: 'saipa',
      image: null,
    });
  });
});
