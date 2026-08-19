import { describe, expect, it } from 'vitest';

import type { ProductRow } from '@/shared/db/schema';

import {
  mapCheckoutProductRow,
  mapProductDetail,
  mapProductRow,
  mapProductSelectRow,
} from '../mappers';
import {
  toProductDetailApiDTO,
  toProductSelectApiResult,
  toProductsPagedApiResult,
} from '../serializers';

const productRow = {
  id: 42,
  name: 'Brake pads',
  model: 'Model X',
  image: '/products/model-x.webp',
  price_pair: 1250,
  price_set: null,
  slug: 'model-x',
  brand_slug: 'brakes',
  brand_id: 7,
} as ProductRow;

describe('product database mappers', () => {
  it('maps a database row to a camelCase domain DTO without changing nullability', () => {
    expect(mapProductRow(productRow)).toEqual({
      id: 42,
      name: 'Brake pads',
      model: 'Model X',
      image: '/products/model-x.webp',
      pricePair: 1250,
      priceSet: null,
      slug: 'model-x',
      brandSlug: 'brakes',
      brandId: 7,
    });
  });

  it('keeps the current snake_case API wire contract in an explicit serializer', () => {
    const result = toProductsPagedApiResult({
      items: [mapProductRow(productRow)],
      page: 1,
      total: 1,
      totalPages: 1,
    });

    expect(result.items[0]).toEqual({
      id: 42,
      name: 'Brake pads',
      model: 'Model X',
      image: '/products/model-x.webp',
      price_pair: 1250,
      price_set: null,
      slug: 'model-x',
      brand_slug: 'brakes',
      brand_id: 7,
    });
  });

  it('keeps the product-select API contract separate from the domain DTO', () => {
    const result = toProductSelectApiResult([
      mapProductSelectRow({ ...productRow, name: null, model: null } as ProductRow),
    ]);

    expect(result).toEqual({
      items: [
        {
          id: 42,
          name: null,
          model: null,
        },
      ],
    });
  });

  it('maps details and checkout projections without exposing the storage row', () => {
    const detail = mapProductDetail(
      productRow,
      [{ image_url: '/products/model-x-2.webp' }],
      [
        {
          id: 43,
          model: 'Model Y',
          image: null,
          price_pair: 1300,
          price_set: 2400,
        },
      ],
    );

    expect(toProductDetailApiDTO(detail)).toMatchObject({
      images: ['/products/model-x-2.webp'],
      related: [
        {
          id: 43,
          price_pair: 1300,
          price_set: 2400,
        },
      ],
    });
    expect(mapCheckoutProductRow(productRow)).toEqual({
      id: 42,
      name: 'Brake pads',
      model: 'Model X',
      pricePair: 1250,
      priceSet: null,
    });
  });
});
