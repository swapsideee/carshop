import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type BrandApiDTO, getBrands } from '@/entities/brand';
import {
  getProducts,
  type ProductListItemApiDTO,
  type ProductsPagedApiResult,
} from '@/entities/product';

import { useProductsCatalog } from '../useProductsCatalog';

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: navigation.push }),
  useSearchParams: () => navigation.searchParams,
}));

vi.mock('@/entities/brand', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/brand')>();

  return { ...actual, getBrands: vi.fn() };
});

vi.mock('@/entities/product', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/product')>();

  return { ...actual, getProducts: vi.fn() };
});

const getBrandsMock = vi.mocked(getBrands);
const getProductsMock = vi.mocked(getProducts);

type Deferred<Value> = {
  promise: Promise<Value>;
  resolve: (value: Value) => void;
};

function createDeferred<Value>(): Deferred<Value> {
  let resolve!: (value: Value) => void;
  const promise = new Promise<Value>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

function createProduct(overrides: Partial<ProductListItemApiDTO> = {}): ProductListItemApiDTO {
  return {
    id: 1,
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

function createBrand(overrides: Partial<BrandApiDTO> = {}): BrandApiDTO {
  return {
    id: 1,
    name: 'Audi',
    slug: 'audi',
    image: '/brands/audi.jpg',
    ...overrides,
  };
}

describe('useProductsCatalog', () => {
  beforeEach(() => {
    navigation.push.mockReset();
    navigation.searchParams = new URLSearchParams();
    getBrandsMock.mockReset();
    getProductsMock.mockReset();
    getBrandsMock.mockResolvedValue([]);
    getProductsMock.mockResolvedValue(createResult());
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps search-param reads and URL update semantics on the public facade', async () => {
    navigation.searchParams = new URLSearchParams(
      'page=3&brand=audi&sort=desc&q=brake+pad&extra=keep',
    );

    const { result } = renderHook(() => useProductsCatalog());

    expect(result.current).toMatchObject({
      page: 3,
      selectedBrand: 'audi',
      sort: 'desc',
      query: 'brake pad',
    });

    await waitFor(() => expect(getProductsMock).toHaveBeenCalledTimes(1));

    act(() => {
      result.current.updateParams({ brand: 'bmw' }, { scrollTop: false });
    });
    act(() => {
      result.current.updateParams({ sort: 'asc' }, { scrollTop: false });
    });
    act(() => {
      result.current.updateParams({ q: 'pads' }, { scrollTop: false });
    });

    expect(navigation.push).toHaveBeenNthCalledWith(
      1,
      '/products?page=1&brand=bmw&sort=desc&q=brake+pad&extra=keep',
      {
        scroll: false,
      },
    );
    expect(navigation.push).toHaveBeenNthCalledWith(
      2,
      '/products?page=1&brand=audi&sort=asc&q=brake+pad&extra=keep',
      {
        scroll: false,
      },
    );
    expect(navigation.push).toHaveBeenNthCalledWith(
      3,
      '/products?page=1&brand=audi&sort=desc&q=pads&extra=keep',
      {
        scroll: false,
      },
    );
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('keeps the initial product and brand data lifecycles observable through the facade', async () => {
    const productsResponse = createDeferred<ProductsPagedApiResult>();
    const brand = createBrand();

    navigation.searchParams = new URLSearchParams('page=2&brand=audi&sort=desc&q=abs');
    getBrandsMock.mockResolvedValue([brand]);
    getProductsMock.mockReturnValue(productsResponse.promise);

    const { result } = renderHook(() => useProductsCatalog());

    expect(result.current.isBootSkeleton).toBe(true);

    await waitFor(() => {
      expect(getProductsMock).toHaveBeenCalledWith({
        page: 2,
        brand: 'audi',
        sort: 'desc',
        q: 'abs',
        signal: expect.any(AbortSignal),
      });
      expect(getBrandsMock).toHaveBeenCalledWith({ signal: expect.any(AbortSignal) });
    });

    await act(async () => {
      productsResponse.resolve(
        createResult({ items: [createProduct()], page: 2, total: 18, totalPages: 3 }),
      );
    });

    await waitFor(() => {
      expect(result.current).toMatchObject({
        items: [createProduct()],
        brands: [brand],
        total: 18,
        totalPages: 3,
        loadedTo: 2,
        isBootSkeleton: false,
      });
    });
  });

  it('keeps load-more pagination, deduplication, and terminal state on the facade', async () => {
    const first = createProduct({ id: 1, slug: 'one' });
    const repeated = createProduct({ id: 1, slug: 'one' });
    const second = createProduct({ id: 2, slug: 'two' });
    const third = createProduct({ id: 3, slug: 'three' });

    getProductsMock
      .mockResolvedValueOnce(createResult({ items: [first], total: 3, totalPages: 3 }))
      .mockResolvedValueOnce(
        createResult({ items: [repeated, second], page: 2, total: 3, totalPages: 3 }),
      )
      .mockResolvedValueOnce(createResult({ items: [third], page: 3, total: 3, totalPages: 3 }));

    const { result } = renderHook(() => useProductsCatalog());

    await waitFor(() => expect(result.current.items).toEqual([first]));

    await act(async () => {
      await result.current.onLoadMore();
    });

    expect(getProductsMock).toHaveBeenNthCalledWith(2, {
      page: 2,
      brand: undefined,
      sort: undefined,
      q: undefined,
    });
    expect(result.current).toMatchObject({
      items: [first, second],
      loadedTo: 2,
      total: 3,
      totalPages: 3,
      canLoadMore: true,
    });

    await act(async () => {
      await result.current.onLoadMore();
    });

    expect(getProductsMock).toHaveBeenNthCalledWith(3, {
      page: 3,
      brand: undefined,
      sort: undefined,
      q: undefined,
    });
    expect(result.current).toMatchObject({
      items: [first, second, third],
      loadedTo: 3,
      total: 3,
      totalPages: 3,
      canLoadMore: false,
    });
  });

  it('aborts stale requests and prevents an abort-insensitive response from replacing current data', async () => {
    const staleResponse = createDeferred<ProductsPagedApiResult>();
    const freshResponse = createDeferred<ProductsPagedApiResult>();
    const staleProduct = createProduct({ id: 1, slug: 'stale' });
    const freshProduct = createProduct({ id: 2, slug: 'fresh' });

    navigation.searchParams = new URLSearchParams('brand=audi');
    getProductsMock
      .mockReturnValueOnce(staleResponse.promise)
      .mockReturnValueOnce(freshResponse.promise);

    const { result, rerender } = renderHook(() => useProductsCatalog());

    await waitFor(() => expect(getProductsMock).toHaveBeenCalledTimes(1));
    const staleSignal = getProductsMock.mock.calls[0]?.[0]?.signal;

    navigation.searchParams = new URLSearchParams('brand=bmw');
    rerender();

    await waitFor(() => expect(getProductsMock).toHaveBeenCalledTimes(2));
    expect(staleSignal?.aborted).toBe(true);

    await act(async () => {
      freshResponse.resolve(createResult({ items: [freshProduct], total: 1, totalPages: 1 }));
    });

    await waitFor(() => {
      expect(result.current).toMatchObject({
        items: [freshProduct],
        total: 1,
        totalPages: 1,
        isBootSkeleton: false,
        isEmpty: false,
      });
    });

    await act(async () => {
      staleResponse.resolve(createResult({ items: [staleProduct], total: 1, totalPages: 1 }));
    });

    expect(result.current.items).toEqual([freshProduct]);
    expect(result.current.isEmpty).toBe(false);
  });
});
