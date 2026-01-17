'use client';

import { ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  getDefaultOption,
  getPriceState,
  getProductImages,
} from '@/entities/product/model/selectors';
import { useAddToCart } from '@/features/cart/add-to-cart/model/useAddToCart';
import { cx } from '@/lib/utils/cx';
import PriceSelector from '@/shared/ui/PriceSelector/PriceSelector';
import ProductGallery from '@/shared/ui/ProductGallery/ProductGallery';

export default function ProductDetails({ product }) {
  const defaultOption = useMemo(() => getDefaultOption(product), [product]);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

  const images = useMemo(() => getProductImages(product), [product]);
  const { bothPricesAvailable, onlyPair, onlySet, noPrice, currentPrice, selectedLabel } = useMemo(
    () => getPriceState(product, selectedOption),
    [product, selectedOption],
  );

  const add = useAddToCart();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 overflow-hidden rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-gray-100 md:flex-row md:p-8">
      <div className="flex w-full min-w-0 justify-center md:basis-1/2">
        <div className="w-full max-w-sm">
          <ProductGallery images={images} />
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-6 md:basis-1/2">
        <div>
          <h1 className="mb-3 text-2xl font-extrabold text-gray-900 md:mb-4 md:text-4xl">
            {product.model}
          </h1>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className={cx(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
                'bg-gray-50 text-gray-700 ring-gray-200',
              )}
            >
              Обрано: {selectedLabel}
            </span>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200">
            <p className="text-xs font-semibold text-gray-600">Ціна</p>

            {noPrice ? (
              <div className="mt-2 text-sm font-semibold text-gray-800">
                За запитом{' '}
                <span className="text-xs font-normal text-gray-500">(зв’яжіться з нами)</span>
              </div>
            ) : (
              <div className="mt-2 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-3xl font-extrabold tracking-tight text-gray-900">
                    {currentPrice} ₴
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    {selectedLabel}
                    {bothPricesAvailable ? (
                      <span className="text-gray-500"> • оберіть варіант нижче</span>
                    ) : null}
                  </div>
                </div>

                {bothPricesAvailable && (
                  <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                    <div className="text-xs text-gray-500">
                      Пара:{' '}
                      <span className="font-semibold text-gray-900">{product.price_pair} ₴</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Комплект:{' '}
                      <span className="font-semibold text-gray-900">{product.price_set} ₴</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {bothPricesAvailable && (
            <div className="mt-4">
              <PriceSelector
                pricePair={product.price_pair}
                priceSet={product.price_set}
                selected={selectedOption}
                onSelect={setSelectedOption}
              />
            </div>
          )}

          {onlyPair && (
            <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
              <p className="text-sm text-gray-700">
                Доступно для замовлення: <span className="font-semibold text-gray-900">Пара</span>
                <span className="ml-0.5 text-red-500">*</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Інформацію про наявність комплекту можна дізнатися, зв&apos;язавшись із менеджером
              </p>
            </div>
          )}

          {onlySet && (
            <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
              <p className="text-sm text-gray-700">
                Доступно для замовлення:{' '}
                <span className="font-semibold text-gray-900">Комплект</span>
                <span className="ml-0.5 text-red-500">*</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Інформацію про наявність пари можна дізнатися, зв&apos;язавшись із менеджером
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-2 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-600">Кріплення</span>
              <span className="font-semibold text-gray-900">саморізи (3–7 шт.)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-600">Стійкість</span>
              <span className="font-semibold text-gray-900">удари каміння та гравію</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-600">Питання по сумісності</span>
              <span className="font-semibold text-gray-900">допоможемо підібрати</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={() => add({ product, selectedOption })}
            disabled={noPrice}
            className={cx(
              'flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-md md:px-6 md:py-4 md:text-base',
              noPrice
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-gray-900 text-white transition-all hover:bg-gray-700 hover:shadow-lg active:shadow-md',
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            {noPrice ? 'Недоступно' : `Додати (${selectedLabel})`}
          </button>
        </div>
      </div>
    </div>
  );
}
