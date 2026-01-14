'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Car, Menu, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useSmartHeader } from '../lib/utils/useSmartHeader';

const NAV = [
  { href: '/products', label: 'Каталог' },
  { href: '/contacts', label: "Зв'язок" },
  { href: '/reviews', label: 'Відгуки' },
];

function cx(...v) {
  return v.filter(Boolean).join(' ');
}

export default function Header() {
  const pathname = usePathname();
  return <HeaderInner key={pathname} pathname={pathname} />;
}

function HeaderInner({ pathname }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { hidden, scrolled } = useSmartHeader(menuOpen);

  const cartCount = 0;

  const isActive = useMemo(
    () => (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href)),
    [pathname],
  );

  const closeMenu = () => setMenuOpen(false);

  const headerBg =
    'pointer-events-none absolute inset-0 bg-white/90 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-sm';

  const headerBgMobile =
    'pointer-events-none absolute inset-0 bg-white/95 supports-[backdrop-filter]:bg-white/85 supports-[backdrop-filter]:backdrop-blur-sm';

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={hidden ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-transparent py-3"
      style={{ pointerEvents: hidden ? 'none' : 'auto' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cx(
            'relative overflow-hidden rounded-3xl border border-black/10 ring-1 ring-black/5',
            scrolled
              ? 'shadow-[0_18px_45px_-30px_rgba(0,0,0,0.6)] ring-black/10'
              : 'shadow-[0_14px_40px_-32px_rgba(0,0,0,0.45)]',
            'transition-shadow',
          )}
        >
          <div className={headerBg} />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent" />

          <div
            className={cx(
              'relative px-3 sm:px-4 transition-[height] duration-200 ease-out',
              scrolled ? 'h-14' : 'h-16',
            )}
          >
            <div className="flex h-full items-center justify-between">
              <Link
                href="/"
                onClick={closeMenu}
                className="group flex items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-black/5"
              >
                <span
                  className={cx(
                    'relative inline-flex items-center justify-center rounded-2xl bg-lime-500/15 ring-1 ring-lime-600/25 transition group-hover:bg-lime-500/20',
                    scrolled ? 'h-9 w-9' : 'h-10 w-10',
                  )}
                >
                  <span className="absolute -inset-2 rounded-2xl bg-lime-500/20 blur-xl opacity-0 transition group-hover:opacity-100" />
                  <Car className="relative h-6 w-6 text-lime-700" />
                </span>

                <div className="leading-tight">
                  <p className="text-[15px] font-extrabold tracking-wide text-slate-900">
                    PLAST<span className="text-lime-700">-</span>AVTO
                  </p>
                  <p className="hidden text-xs text-slate-500 sm:block">Автотовари • Підкрилки</p>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                {NAV.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={cx(
                        'group relative rounded-2xl px-3 py-2 text-sm font-semibold transition',
                        active
                          ? 'bg-black/5 text-slate-900'
                          : 'text-slate-700 hover:bg-black/5 hover:text-slate-900',
                      )}
                    >
                      {item.label}
                      <span
                        className={cx(
                          'pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-lime-600 transition-all',
                          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                        )}
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2">
                <Link
                  href="/cart"
                  onClick={closeMenu}
                  className="relative inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-black/5 hover:text-slate-900"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden sm:inline">Кошик</span>

                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-600 px-1 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center rounded-2xl p-2 text-slate-800 transition hover:bg-black/5"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Toggle navigation"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-nav"
                >
                  {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                id="mobile-nav"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="relative border-t border-black/10 md:hidden"
              >
                <div className={headerBgMobile} />
                <div className="relative flex flex-col gap-1 px-3 py-3 sm:px-4">
                  {NAV.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className={cx(
                          'rounded-2xl px-3 py-2 text-sm font-semibold transition',
                          active
                            ? 'bg-lime-500/15 text-slate-900 ring-1 ring-lime-600/25'
                            : 'text-slate-700 hover:bg-black/5 hover:text-slate-900',
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  <Link
                    href="/cart"
                    onClick={closeMenu}
                    className={cx(
                      'rounded-2xl px-3 py-2 text-sm font-semibold transition',
                      pathname?.startsWith('/cart')
                        ? 'bg-lime-500/15 text-slate-900 ring-1 ring-lime-600/25'
                        : 'text-slate-700 hover:bg-black/5 hover:text-slate-900',
                    )}
                  >
                    Кошик
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
