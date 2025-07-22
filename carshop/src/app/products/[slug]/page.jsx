"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import useCartStore from "@/app/store/cartStore";
import PriceSelector from "@/components/PriceSelector";

export default function ProductOrBrandPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [brandProducts, setBrandProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("pair");
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
          setBrandProducts(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.slug, isProductId]);

  useEffect(() => {
    if (product) {
      if (product.price_pair !== null && product.price_set === null) {
        setSelectedOption("pair");
      } else if (product.price_set !== null && product.price_pair === null) {
        setSelectedOption("set");
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    const price =
      selectedOption === "pair" ? product.price_pair : product.price_set;

    if (!price) {
      toast.error("Ціна для обраного варіанту відсутня");
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedOption}`,
      name: `${product.model} (${
        selectedOption === "pair" ? "Пара" : "Комплект"
      })`,
      price,
      image: product.image,
    };

    addToCart(cartItem);
    toast.success("Товар додано до кошику");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-900 mt-20 text-lg animate-pulse">
            Завантаження...
          </div>
        </div>
      </div>
    );
  }

  if (!isProductId) {
    return (
      <div className="max-w-7xl mx-auto w-full p-6">
        <h1 className="text-center text-5xl mb-8 text-gray-800 font-bold uppercase">
          {params.slug}
        </h1>
        {brandProducts.length === 0 ? (
          <div className="text-gray-900 text-center text-sm">
            Товарів цього бренду не знайдено.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 flex-1 rounded-xl h-full">
            {brandProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} clickable={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500 mt-20">
            <h1 className="text-2xl font-bold mb-4">Товар не знайдено</h1>
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

  const bothPricesAvailable =
    product.price_pair !== null && product.price_set !== null;
  const onlyPair = product.price_pair !== null && product.price_set === null;
  const onlySet = product.price_set !== null && product.price_pair === null;
  const noPrice = product.price_pair === null && product.price_set === null;

  return (
    <div className="min-h-screen px-4 py-10 space-y-16">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-md shadow-2xl overflow-hidden flex flex-col md:flex-row gap-8 p-4 md:p-8">
        <div className="w-full md:basis-1/2 min-w-0 flex justify-center">
          <div className="w-full max-w-sm">
            <ProductGallery images={productImages} />
          </div>
        </div>

        <div className="w-full md:basis-1/2 min-w-0 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-6">
              {product.model}
            </h1>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 mt-6">
              <div>
                <p className="text-md text-gray-900">Ціна за пару:</p>
                <p className="text-xl font-semibold">
                  {product.price_pair !== null ? (
                    <span className="text-black font-bold text-2xl">
                      {product.price_pair} ₴
                    </span>
                  ) : (
                    <span className="text-gray-900 font-normal text-md">
                      За запитом
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-md text-gray-900">Ціна за комплект:</p>
                <p className="text-xl font-semibold">
                  {product.price_set !== null ? (
                    <span className="text-black font-bold text-2xl">
                      {product.price_set} ₴
                    </span>
                  ) : (
                    <span className="text-gray-900 font-normal text-md">
                      За запитом
                    </span>
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
                <p className="text-sm text-gray-600 mb-4">
                  Для замовлення цього товару доступна тільки{" "}
                  <span className="font-semibold text-black">Пара</span>
                  <span className="text-red-500 ml-0.5">*</span>
                </p>
                <p className="text-sm text-gray-400">
                  Інформацію про наявність комплекту можна дізнатися,
                  зв'язавшись із менеджером
                </p>
              </>
            )}

            {onlySet && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Для замовлення цього товару доступний тільки:{" "}
                  <span className="font-semibold text-black">Комплект</span>
                  <span className="text-red-500 ml-0.5">*</span>
                </p>
                <p className="text-sm text-gray-400">
                  Інформацію про наявність пари можна дізнатися, зв'язавшись із
                  менеджером
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={noPrice}
              className={`${
                noPrice
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              } text-sm md:text-base py-3 px-4 md:py-4 md:px-6 rounded-2xl shadow-md font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer`}
            >
              <ShoppingCart className="w-5 h-5" />
              {noPrice ? "Недоступно" : "Додати до кошика"}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <DescriptionBlock />
      </div>

      {product.related?.length > 0 && (
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Схожі товари
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
      <h2 className="text-gray-900 text-xl font-semibold mb-6">Опис товару</h2>
      <p
        className={`text-gray-700 text-sm leading-relaxed transition-all duration-300 ease-in-out ${
          expanded
            ? "line-clamp-none max-h-none"
            : "max-h-[4rem] overflow-hidden"
        }`}
      >
        {text}
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none" />
        )}
      </p>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-2 text-sm font-bold text-lime-700 hover:text-lime-600 focus:outline-none transition-colors cursor-pointer"
      >
        {expanded ? "Згорнути" : "Розгорнути повнiстю"}
      </button>
    </div>
  );
}
