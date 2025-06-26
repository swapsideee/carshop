import Link from "next/link";

export default function ProductCard({ product, clickable = false }) {
  const showName = product.name && product.name !== product.model;

  const content = (
    <div
      className={
        "bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 p-5 flex flex-col h-full" +
        (clickable ? " cursor-pointer" : "")
      }
    >
      <div className="w-full aspect-[4/3] bg-white border rounded-lg flex items-center justify-center mb-4">
        <img
          loading="lazy"
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="flex flex-col flex-grow items-center text-center">
        {showName && (
          <p className="text-xs uppercase text-gray-400 tracking-wide mb-1 line-clamp-1">
            {product.name}
          </p>
        )}

        <p className="font-semibold text-base text-gray-800 mb-2 line-clamp-2">
          {product.model}
        </p>

        <div className="mt-auto space-y-1">
          <p className="text-sm text-gray-700">
            Пара:{" "}
            {product.price_pair !== null ? (
              <span className="text-black font-medium">
                {product.price_pair} грн
              </span>
            ) : (
              <span className="font-bold text-lime-600">За запитом</span>
            )}
          </p>

          <p className="text-sm text-gray-700">
            Комплект:{" "}
            {product.price_set !== null ? (
              <span className="text-black font-medium">
                {product.price_set} грн
              </span>
            ) : (
              <span className="text-lime-600 font-bold">За запитом</span>
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
