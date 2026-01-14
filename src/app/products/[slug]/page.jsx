'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import useCartStore from '@/app/store/cartStore';
import PriceSelector from '@/components/PriceSelector';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';

export default function ProductOrBrandPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [brandProducts, setBrandProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('pair');
  const addToCart = useCartStore((state) => state.addToCart);
  const isProductId = !isNaN(Number(params.slug));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (isProductId) {
          const response = await fetch(`/api/products/${params.slug}`);
          const data = await response.json();
          setProduct(data);
        } else {
          const response = await fetch(`/api/products?brand=${params.slug}`);
          const data = await response.json();
          setBrandProducts(Array.isArray(data?.items) ? data.items : []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug, isProductId]);

  useEffect(() => {
    if (product) {
      if (product.price_pair !== null && product.price_set === null) {
        setSelectedOption('pair');
      } else if (product.price_set !== null && product.price_pair === null) {
        setSelectedOption('set');
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    const price = selectedOption === 'pair' ? product.price_pair : product.price_set;

    if (price == null) {
      toast.error('Ціна для обраного варіанту відсутня');
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedOption}`,
      name: `${product.model} (${selectedOption === 'pair' ? 'Пара' : 'Комплект'})`,
      price,
      image: product.image,
    };
    const res = addToCart(cartItem);

    if (!res?.ok) {
      toast.error(res?.message || 'Не вдалося додати товар');
      return;
    }

    toast.success('Товар додано до кошику');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-20 animate-pulse text-center text-lg text-gray-900">
            Завантаження...
          </div>
        </div>
      </div>
    );
  }

  if (!isProductId) {
    const brandName = String(params.slug || '').toUpperCase();

    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-extrabold tracking-wide text-gray-900 sm:text-5xl">
            Підкрилки для бренду <span className="uppercase">{brandName}</span>
          </h1>

          <div className="mt-10">
            {brandProducts.length === 0 ? (
              <div className="text-center text-sm text-gray-900">
                Товарів цього бренду не знайдено.
              </div>
            ) : (
              <div className="mx-auto w-full max-w-6xl">
                <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2 justify-items-center">
                  {brandProducts.map((p) => (
                    <div key={p.id} className="w-full">
                      <ProductCard product={p} clickable />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-20 text-center text-gray-500">
            <h1 className="mb-4 text-2xl font-bold">Товар не знайдено</h1>
            <Link href="/products" className="text-gray-900 hover:underline">
              Повернутися до каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productImages = product.images?.length
    ? [product.image, ...product.images]
    : [product.image].filter(Boolean);

  const bothPricesAvailable = product.price_pair !== null && product.price_set !== null;
  const onlyPair = product.price_pair !== null && product.price_set === null;
  const onlySet = product.price_set !== null && product.price_pair === null;
  const noPrice = product.price_pair === null && product.price_set === null;

  return (
    <div className="min-h-screen space-y-16 px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 overflow-hidden rounded-md bg-white p-4 shadow-2xl md:flex-row md:p-8">
        <div className="flex w-full min-w-0 justify-center md:basis-1/2">
          <div className="w-full max-w-sm">
            <ProductGallery images={productImages} />
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-6 md:basis-1/2">
          <div>
            <h1 className="mb-4 text-2xl font-extrabold text-gray-800 md:mb-6 md:text-4xl">
              {product.model}
            </h1>

            <div className="mb-6 mt-6 space-y-3 md:mb-8 md:space-y-4">
              <div>
                <p className="text-md text-gray-900">Ціна за пару:</p>
                <p className="text-xl font-semibold">
                  {product.price_pair !== null ? (
                    <span className="text-2xl font-bold text-black">{product.price_pair} ₴</span>
                  ) : (
                    <span className="text-md font-normal text-gray-900">За запитом</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-md text-gray-900">Ціна за комплект:</p>
                <p className="text-xl font-semibold">
                  {product.price_set !== null ? (
                    <span className="text-2xl font-bold text-black">{product.price_set} ₴</span>
                  ) : (
                    <span className="text-md font-normal text-gray-900">За запитом</span>
                  )}
                </p>
              </div>
            </div>

            {bothPricesAvailable && (
              <PriceSelector
                pricePair={product.price_pair}
                priceSet={product.price_set}
                selected={selectedOption}
                onSelect={setSelectedOption}
              />
            )}

            {onlyPair && (
              <>
                <p className="mb-4 text-sm text-gray-600">
                  Для замовлення цього товару доступна тільки{' '}
                  <span className="font-semibold text-black">Пара</span>
                  <span className="ml-0.5 text-red-500">*</span>
                </p>
                <p className="text-sm text-gray-400">
                  Інформацію про наявність комплекту можна дізнатися, зв&apos;язавшись із менеджером
                </p>
              </>
            )}

            {onlySet && (
              <>
                <p className="mb-4 text-sm text-gray-600">
                  Для замовлення цього товару доступний тільки:{' '}
                  <span className="font-semibold text-black">Комплект</span>
                  <span className="ml-0.5 text-red-500">*</span>
                </p>
                <p className="text-sm text-gray-400">
                  Інформацію про наявність пари можна дізнатися, зв&apos;язавшись із менеджером
                </p>
              </>
            )}
          </div>

          <div className="mt-auto flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              disabled={noPrice}
              className={`${
                noPrice
                  ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              } flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-md transition-colors md:px-6 md:py-4 md:text-base`}
            >
              <ShoppingCart className="h-5 w-5" />
              {noPrice ? 'Недоступно' : 'Додати до кошика'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <DescriptionBlock />
      </div>

      {product.related?.length > 0 && (
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">Схожі товари</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2">
            {product.related.map((p) => (
              <ProductCard key={p.id} product={p} clickable />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DescriptionBlock() {
  const [expanded, setExpanded] = useState(false);

  const text = `Підкрилки компанії Mega Locker виготовляються з поліетилену низького тиску спеціальної марки без домішок та відходів первинних матеріалів. Це забезпечує високі фізико-механічні властивості виробів: підкрилки залишаються еластичними у великому температурному діапазоні від 200 до -70 градусів за Цельсієм, мають високу міцність та витримують удари каміння й гравію.

Сучасні технології та професіоналізм дозволили створити матриці захисних арок для багатьох моделей автомобілів, завдяки чому підкрилки ідеально відповідають формі колісних арок. Вони кріпляться трьома-сімома саморізами по краю крила та двома в глибині ніші.

Перед запуском серійного виробництва кожна нова модель підкрилків проходить ретельні випробування та обов'язкову сертифікацію у Держспоживстандарті України.

У нашому інтернет-магазині ви можете придбати підкрилки від ТМ "Mega Locker" — якісні, доступні та практичні вироби, що стануть надійним захистом вашого авто.
`;

  return (
    <div className="relative mt-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Опис товару</h2>
      <p
        className={`text-sm leading-relaxed text-gray-700 transition-all duration-300 ease-in-out ${
          expanded ? 'line-clamp-none max-h-none' : 'max-h-16 overflow-hidden'
        }`}
      >
        {text}
        {!expanded && <div className="pointer-events-none absolute bottom-0 left-0 h-10 w-full" />}
      </p>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-2 cursor-pointer text-sm font-bold text-lime-700 transition-colors hover:text-lime-600 focus:outline-none"
      >
        {expanded ? 'Згорнути' : 'Розгорнути повнiстю'}
      </button>
    </div>
  );
}
