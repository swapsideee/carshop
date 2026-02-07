'use client';

import { CreditCard, Mail, Phone, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0">
      <div className="border-t border-black/5 bg-linear-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-10 grid gap-3 sm:grid-cols-3">
            {[
              { Icon: Truck, title: 'Швидка відправка', desc: 'По Україні щодня' },
              {
                Icon: ShieldCheck,
                title: 'Гарантія якості',
                desc: 'Перевіряємо товар перед відправкой',
              },
              { Icon: CreditCard, title: 'Зручна оплата', desc: 'Карта / післяплата' },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className={[
                  'group flex items-center gap-3 rounded-2xl p-4',
                  'border border-slate-200/70 ring-1 ring-black/5',
                  'bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/70',
                  'shadow-[0_12px_30px_-22px_rgba(0,0,0,0.45)]',
                  'transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_45px_-26px_rgba(0,0,0,0.55)]',
                ].join(' ')}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-lime-700/10 bg-lime-500/15 ring-1 ring-lime-600/25">
                  <Icon className="h-5 w-5 text-lime-700" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:items-start">
            <div>
              <p className="text-base font-extrabold text-slate-900">
                PLAST<span className="text-lime-700">-</span>AVTO
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Підкрилки для авто. Швидке та надійне обслуговування.
              </p>
            </div>

            <div className="md:col-span-2 rounded-2xl border border-black/5 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/60 ring-1 ring-black/5 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]">
              <div className="grid gap-8 p-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Магазин</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>
                      <Link href="/products" className="text-slate-600 hover:text-slate-900">
                        Каталог
                      </Link>
                    </li>
                    <li>
                      <Link href="/reviews" className="text-slate-600 hover:text-slate-900">
                        Відгуки
                      </Link>
                    </li>
                    <li>
                      <Link href="/cart" className="text-slate-600 hover:text-slate-900">
                        Кошик
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Підтримка</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>
                      <Link href="/contacts" className="text-slate-600 hover:text-slate-900">
                        Зв&apos;язок
                      </Link>
                    </li>
                    <li>
                      <a
                        href="mailto:example@gmail.com"
                        className="text-slate-600 hover:text-slate-900"
                      >
                        example@gmail.com
                      </a>
                    </li>
                    <li>
                      <a href="tel:+381234567899" className="text-slate-600 hover:text-slate-900">
                        +38 123 456 7899
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Контакти</p>
                  <p className="mt-3 text-sm text-slate-600">
                    Напишіть або зателефонуйте — підкажемо по наявності та підбору.
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <a
                      href="mailto:example@gmail.com"
                      className={[
                        'group flex items-center gap-2 rounded-xl bg-white px-3 py-2 font-semibold text-slate-900',
                        'ring-1 ring-black/5 shadow-[0_10px_25px_-20px_rgba(0,0,0,0.35)]',
                        'transition-all duration-200',
                        'hover:-translate-y-0.5 hover:bg-lime-50/60 hover:ring-lime-600/25 hover:shadow-[0_18px_45px_-28px_rgba(0,0,0,0.45)]',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-600/40',
                      ].join(' ')}
                    >
                      <Mail className="h-4 w-4 text-lime-700 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3" />
                      <span className="truncate">example@gmail.com</span>
                    </a>

                    <a
                      href="tel:+381234567899"
                      className={[
                        'group flex items-center gap-2 rounded-xl bg-white px-3 py-2 font-semibold text-slate-900',
                        'ring-1 ring-black/5 shadow-[0_10px_25px_-20px_rgba(0,0,0,0.35)]',
                        'transition-all duration-200',
                        'hover:-translate-y-0.5 hover:bg-lime-50/60 hover:ring-lime-600/25 hover:shadow-[0_18px_45px_-28px_rgba(0,0,0,0.45)]',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-600/40',
                      ].join(' ')}
                    >
                      <Phone className="h-4 w-4 text-lime-700 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3" />
                      <span className="truncate">+38 123 456 7899</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} PLAST-AVTO. Усі права захищені.</p>

            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime-600" />
              <p className="text-slate-400">Зроблено для вашої зручності</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
