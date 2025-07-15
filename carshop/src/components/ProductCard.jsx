import Link from "next/link";

export default function ProductCard({ product, clickable = false }) {
  const showName = product.name && product.name !== product.model;

  const content = (
    <div
      className={
        "flex flex-col border border-gray-300 rounded-lg bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-[2px] h-full" +
        (clickable ? " cursor-pointer" : "")
      }
    >
      <div className="w-full aspect-[3/3] bg-white flex items-center justify-center p-4 border-b xl:border-gray-100 sm:border-gray-300">
        <img
          loading="lazy"
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="p-3 flex flex-col flex-grow">
        {showName && (
          <p className="text-md text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </p>
        )}

        <p className="xl:text-md font-extrabold text-gray-800 mb-2 line-clamp-2">
          {product.model}
        </p>

        <div className="mt-auto space-y-1">
          <p className="sm:text-lg xl:text-sm text-gray-900">
            Пара:{" "}
            {product.price_pair !== null ? (
              <span className="text-gray-800 font-semibold text-base">
                {product.price_pair} грн
              </span>
            ) : (
              <span className="text-gray-600 font-medium">За запитом</span>
            )}
          </p>

          <p className="sm:text-lg xl:text-sm text-gray-900">
            Комплект:{" "}
            {product.price_set !== null ? (
              <span className="text-gray-800 font-semibold text-base">
                {product.price_set} грн
              </span>
            ) : (
              <span className="text-gray-600 font-medium">За запитом</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );

  return clickable ? (
    <Link href={`/products/${product.id}`} className="block h-full">
      {content}
    </Link>
  ) : (
    <div className="h-full">{content}</div>
  );
}
