import Link from "next/link";

export default function ProductCard({ product, clickable = false }) {
  const showName = product.name && product.name !== product.model;

  const content = (
    <div
      className={
        "bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 p-5 flex flex-col items-center text-center" +
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

      {showName && (
        <p className="text-xs uppercase text-gray-400 tracking-wide mb-1">
          {product.name}
        </p>
      )}

      <p className="font-semibold text-base text-gray-800 mb-2">
        {product.model}
      </p>

      <p className="text-sm text-gray-700">
        Пара:{" "}
        {product.price_pair !== null ? (
          <span className="text-black font-medium">
            {product.price_pair} грн
          </span>
        ) : (
          <span className="text-red-500 font-bold">Уточнюйте</span>
        )}
      </p>

      <p className="text-sm text-gray-700">
        Комплект:{" "}
        {product.price_set !== null ? (
          <span className="text-black font-medium">
            {product.price_set} грн
          </span>
        ) : (
          <span className="text-red-500 font-bold">Уточнюйте</span>
        )}
      </p>
    </div>
  );

  return clickable ? (
    <Link href={`/products/${product.id}`} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
