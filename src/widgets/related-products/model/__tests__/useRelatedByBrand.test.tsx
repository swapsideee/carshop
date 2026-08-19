import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getProductsByBrand,
  type ProductDetailApiDTO,
  type ProductListItemApiDTO,
} from '@/entities/product';

import { useRelatedByBrand } from '../useRelatedByBrand';

vi.mock('@/entities/product', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/product')>();

  return {
    ...actual,
    getProductsByBrand: vi.fn(),
  };
});

const getProductsByBrandMock = vi.mocked(getProductsByBrand);

function createProduct(overrides: Partial<ProductDetailApiDTO> = {}): ProductDetailApiDTO {
  return {
    id: 1,
    name: 'Current product',
    model: 'Current model',
    image: null,
    price_pair: 100,
    price_set: null,
    slug: '1',
    brand_slug: 'audi',
    brand_id: 1,
    images: [],
    related: [],
    ...overrides,
  };
}

function createListItem(overrides: Partial<ProductListItemApiDTO> = {}): ProductListItemApiDTO {
  return {
    id: 2,
    name: 'Related product',
    model: 'Related model',
    image: null,
    price_pair: 200,
    price_set: null,
    slug: '2',
    brand_slug: 'audi',
    brand_id: 1,
    ...overrides,
  };
}

describe('useRelatedByBrand', () => {
  beforeEach(() => {
    getProductsByBrandMock.mockReset();
  });

  it('loads products for the current brand and filters out the current product', async () => {
    const currentProduct = createProduct();
    const relatedProduct = createListItem();

    getProductsByBrandMock.mockResolvedValue({
      items: [currentProduct, relatedProduct],
      page: 1,
      total: 2,
      totalPages: 1,
    });

    const { result } = renderHook(() => useRelatedByBrand(currentProduct));

    await waitFor(() => expect(result.current.items).toEqual([relatedProduct]));

    const request = getProductsByBrandMock.mock.calls[0]?.[0];
    expect(request?.brand).toBe('audi');
    expect(request?.signal?.aborted).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('aborts the in-flight request when the hook unmounts', async () => {
    let signal: AbortSignal | undefined;
    const product = createProduct();

    getProductsByBrandMock.mockImplementation((params) => {
      signal = params?.signal;

      return new Promise(() => {});
    });

    const { unmount } = renderHook(() => useRelatedByBrand(product));

    await waitFor(() => expect(getProductsByBrandMock).toHaveBeenCalledTimes(1));
    unmount();

    expect(signal?.aborted).toBe(true);
  });
});
