import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getProductsByBrand,
  type ProductListItemApiDTO,
  type ProductsPagedApiResult,
} from '@/entities/product';

import { useBrandProducts } from '../useBrandProducts';

vi.mock('@/entities/product', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/product')>();

  return {
    ...actual,
    getProductsByBrand: vi.fn(),
  };
});

const getProductsByBrandMock = vi.mocked(getProductsByBrand);

function createProduct(overrides: Partial<ProductListItemApiDTO> = {}): ProductListItemApiDTO {
  return {
    id: 42,
    name: 'Product name',
    model: 'Product model',
    image: '/product.jpg',
    price_pair: 600,
    price_set: 1200,
    slug: 'product-model',
    brand_slug: 'audi',
    brand_id: 1,
    ...overrides,
  };
}

function createResult(overrides: Partial<ProductsPagedApiResult> = {}): ProductsPagedApiResult {
  return {
    items: [],
    page: 1,
    total: 0,
    totalPages: 1,
    ...overrides,
  };
}

describe('useBrandProducts', () => {
  beforeEach(() => {
    getProductsByBrandMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the existing request shape and stores the typed result', async () => {
    const product = createProduct();
    getProductsByBrandMock.mockResolvedValue(createResult({ items: [product], total: 1 }));

    const { result } = renderHook(() => useBrandProducts('audi'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.items).toEqual([product]));

    expect(result.current.loading).toBe(false);
    expect(getProductsByBrandMock).toHaveBeenCalledWith({
      brand: 'audi',
      signal: expect.any(AbortSignal),
    });
  });

  it('keeps an empty brand local without making a request', async () => {
    const { result } = renderHook(() => useBrandProducts(undefined));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual([]);
    expect(getProductsByBrandMock).not.toHaveBeenCalled();
  });

  it('keeps the existing empty-state fallback after a non-abort error', async () => {
    getProductsByBrandMock.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useBrandProducts('audi'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual([]);
  });

  it('aborts in-flight requests on rerender and unmount', async () => {
    const signals: AbortSignal[] = [];
    getProductsByBrandMock.mockImplementation((params = {}) => {
      const { signal } = params;
      if (signal) signals.push(signal);
      return new Promise(() => {});
    });

    const { rerender, unmount } = renderHook(({ brand }) => useBrandProducts(brand), {
      initialProps: { brand: 'audi' },
    });

    await waitFor(() => expect(getProductsByBrandMock).toHaveBeenCalledTimes(1));
    rerender({ brand: 'bmw' });

    await waitFor(() => expect(getProductsByBrandMock).toHaveBeenCalledTimes(2));
    expect(signals[0]?.aborted).toBe(true);

    unmount();

    expect(signals[1]?.aborted).toBe(true);
  });
});
