import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BrandApiDTO } from '@/entities/brand';

import Banner from '../Banner';

const getBrandsMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/brand', () => ({
  getBrands: getBrandsMock,
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: PropsWithChildren) => <>{children}</>,
  motion: {
    div: ({ children }: PropsWithChildren) => <div>{children}</div>,
  },
  useReducedMotion: () => false,
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <span aria-label={alt} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: PropsWithChildren<{ href: string }>) => (
    <a href={href}>{children}</a>
  ),
}));

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

function brand(id: number, name: string, slug: string): BrandApiDTO {
  return {
    id,
    name,
    slug,
    image: `/brands/${slug}.png`,
  };
}

function getCardHrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="/products/"]')).map(
    (link) => link.getAttribute('href') ?? '',
  );
}

describe('Banner', () => {
  beforeEach(() => {
    getBrandsMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps eight skeleton cards, the current mixed-script order, and the 8-to-14 load-more step', async () => {
    const user = userEvent.setup();
    const response = createDeferred<BrandApiDTO[]>();
    const brands = [
      brand(1, 'Volvo', 'volvo'),
      brand(2, 'Альфа', 'alfa'),
      brand(3, 'Audi', 'audi'),
      brand(4, 'Бета', 'beta'),
      brand(5, 'BMW', 'bmw'),
      brand(6, 'Вольво', 'volvo-ua'),
      brand(7, 'Citroen', 'citroen'),
      brand(8, 'Гамма', 'gamma'),
      brand(9, 'Dacia', 'dacia'),
      brand(10, 'Дніпро', 'dnipro'),
      brand(11, 'Ford', 'ford'),
      brand(12, 'Єва', 'eva'),
      brand(13, 'Honda', 'honda'),
      brand(14, 'Kia', 'kia'),
    ];

    getBrandsMock.mockReturnValue(response.promise);

    const { container } = render(<Banner />);

    expect(container.querySelectorAll('div.aspect-square')).toHaveLength(8);

    await act(async () => {
      response.resolve(brands);
    });

    await waitFor(() => {
      expect(getCardHrefs(container)).toEqual([
        '/products/audi',
        '/products/bmw',
        '/products/citroen',
        '/products/dacia',
        '/products/ford',
        '/products/honda',
        '/products/kia',
        '/products/volvo',
      ]);
    });

    await user.click(screen.getByRole('button'));

    expect(getCardHrefs(container)).toEqual([
      '/products/audi',
      '/products/bmw',
      '/products/citroen',
      '/products/dacia',
      '/products/ford',
      '/products/honda',
      '/products/kia',
      '/products/volvo',
      '/products/alfa',
      '/products/beta',
      '/products/volvo-ua',
      '/products/gamma',
      '/products/dnipro',
      '/products/eva',
    ]);
  });

  it('keeps the non-abort error log and empty fallback', async () => {
    const error = new Error('Failed to load brands');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getBrandsMock.mockRejectedValue(error);

    const { container } = render(<Banner />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error loading brands:', error);
    });

    expect(getCardHrefs(container)).toEqual([]);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('narrows nullable DTO fields only while rendering cards', async () => {
    const incomplete: BrandApiDTO = {
      id: 1,
      name: null,
      slug: null,
      image: null,
    };
    const renderableBrands = Array.from({ length: 8 }, (_, index) =>
      brand(index + 2, `Brand ${index}`, `brand-${index}`),
    );
    getBrandsMock.mockResolvedValue([incomplete, ...renderableBrands]);

    const user = userEvent.setup();
    const { container } = render(<Banner />);

    await waitFor(() => {
      expect(getCardHrefs(container)).toHaveLength(7);
    });

    expect(getCardHrefs(container)).not.toContain('/products/null');
    expect(screen.getByRole('button')).toBeEnabled();

    await user.click(screen.getByRole('button'));

    expect(getCardHrefs(container)).toHaveLength(8);
  });

  it('aborts the in-flight request on unmount', async () => {
    let signal: AbortSignal | undefined;
    getBrandsMock.mockImplementation(({ signal: requestSignal }: { signal?: AbortSignal }) => {
      signal = requestSignal;
      return new Promise<BrandApiDTO[]>(() => {});
    });

    const { unmount } = render(<Banner />);

    await waitFor(() => {
      expect(signal).toBeDefined();
    });

    unmount();

    expect(signal?.aborted).toBe(true);
  });

  it('does not let an abort-insensitive stale StrictMode response overwrite the current one', async () => {
    const firstResponse = createDeferred<BrandApiDTO[]>();
    const secondResponse = createDeferred<BrandApiDTO[]>();
    getBrandsMock
      .mockReturnValueOnce(firstResponse.promise)
      .mockReturnValueOnce(secondResponse.promise);

    const { container } = render(
      <StrictMode>
        <Banner />
      </StrictMode>,
    );

    await waitFor(() => {
      expect(getBrandsMock).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondResponse.resolve([brand(2, 'Fresh', 'fresh')]);
    });

    await waitFor(() => {
      expect(getCardHrefs(container)).toEqual(['/products/fresh']);
    });

    await act(async () => {
      firstResponse.resolve([brand(1, 'Stale', 'stale')]);
    });

    expect(getCardHrefs(container)).toEqual(['/products/fresh']);
  });
});
