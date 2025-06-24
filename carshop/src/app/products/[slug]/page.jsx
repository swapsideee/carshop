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
      <div className="min-h-screen bg-zinc-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500 mt-20 text-lg animate-pulse">
            Завантаження...
          </div>
        </div>
      </div>
    );
  }

  if (!isProductId) {
    return (
      <div className="w-fit mx-auto bg-gray-100 p-6 rounded-xl shadow-md">
        <h1 className="text-4xl font-extrabold mb-4 text-black uppercase">
          {params.slug}
        </h1>

        {brandProducts.length === 0 ? (
          <div className="text-gray-500 text-center text-sm">
            Товарів цього бренду не знайдено.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {brandProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} clickable={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500 mt-20">
            <h1 className="text-2xl font-bold mb-4">Товар не знайдено</h1>
            <Link href="/products" className="text-blue-500 hover:underline">
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
    <div className="min-h-screen bg-white px-4 py-10 cursor-default space-y-16">
      <div className="w-full max-w-6xl mx-auto bg-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row gap-8 p-4 md:p-8">
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
                <p className="text-sm text-gray-600">Ціна за пару:</p>
                <p className="text-xl font-semibold">
                  {product.price_pair !== null ? (
                    <span className="text-black">{product.price_pair} грн</span>
                  ) : (
                    <span className="text-lime-600">За запитом</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Ціна за комплект:</p>
                <p className="text-xl font-semibold">
                  {product.price_set !== null ? (
                    <span className="text-black">{product.price_set} грн</span>
                  ) : (
                    <span className="text-lime-600">За запитом</span>
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
                <p className="text-sm text-gray-600 mb-4 underline">
                  Для замовлення цього товару доступна тільки{" "}
                  <span className="font-semibold text-black">Пара</span>
                </p>
                <p className="text-sm text-gray-600">
                  Інформацію про наявність комплекту можна дізнатися,
                  зв'язавшись із менеджером
                </p>
              </>
            )}

            {onlySet && (
              <>
                <p className="text-sm text-gray-600 mb-4 underline">
                  Для замовлення цього товару доступний тільки:{" "}
                  <span className="font-semibold text-black">Комплект</span>
                </p>
                <p className="text-sm text-gray-600">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Схожі товари
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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

  const text = `Підкрилки виробництва ТМ "Mega Locker". Оптимальне поєднання високої якості та доступної ціни. Виготовлені з високоякісного еластичного пластику, мають високу зносостійкість, що дозволяє зберігати за будь-яких умов фізичну форму та властивості. Є модельними, кріпляться до крила та кузова звичайними шурупами. Форма виробів спеціально розроблена під колісну арку даного автомобіля, спрощує встановлення та продовжує термін служби захисту. Вони легко переносять високі температури і різні навантаження, що робить їх практичнішими за металеві вироби.`;
  return (
    <div className="relative mt-6">
      <p
        className={`text-gray-700 text-sm leading-relaxed transition-all duration-300 ease-in-out ${
          expanded
            ? "line-clamp-none max-h-none"
            : "max-h-[3rem] overflow-hidden"
        }`}
      >
        {text}
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
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
