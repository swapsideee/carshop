import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Header from '../Header';

const state = vi.hoisted(() => ({
  cartCount: 2,
  pathname: '/products' as string | null,
}));

const cartMocks = vi.hoisted(() => ({
  selectCartCount: vi.fn(),
  useCartStore: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => state.pathname,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...props }: ComponentProps<'a'>) => (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

vi.mock('@/features/cart', () => ({
  selectCartCount: cartMocks.selectCartCount,
  useCartStore: cartMocks.useCartStore,
}));

vi.mock('@/shared/lib', () => ({
  cx: (...classes: Array<string | boolean | undefined>) => classes.filter(Boolean).join(' '),
  useSmartHeader: () => ({ hidden: false, scrolled: false }),
}));

describe('Header', () => {
  beforeEach(() => {
    state.pathname = '/products';
    state.cartCount = 2;
    cartMocks.useCartStore.mockReset();
    cartMocks.useCartStore.mockReturnValue(state.cartCount);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the active desktop route, cart badge, and mobile navigation lifecycle wired', async () => {
    const user = userEvent.setup();

    render(<Header />);

    expect(cartMocks.useCartStore).toHaveBeenCalledWith(cartMocks.selectCartCount);
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveClass('bg-black/5');
    expect(screen.getByLabelText('Cart')).toHaveTextContent('2');

    const menuButton = screen.getByRole('button', { name: 'Toggle navigation' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const mobileNav = document.getElementById('mobile-nav');
    expect(mobileNav).toBeInTheDocument();

    await user.click(within(mobileNav!).getByRole('link', { name: "Зв'язок" }));

    await waitFor(() => {
      expect(document.getElementById('mobile-nav')).not.toBeInTheDocument();
    });
  });
});
