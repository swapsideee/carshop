import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, clickable = false }) {
  const showName = product.name && product.name !== product.model;

  const content = (
    <div
      className={
        'flex h-full flex-col overflow-hidden rounded-xl border-2 border-gray-300 bg-white ' +
        'transition-[box-shadow,border-color] duration-400 ease-in-out ' +
        'hover:border-gray-500 hover:shadow-lg' +
        (clickable ? ' cursor-pointer' : '')
      }
    >
      <div className="relative flex aspect-square w-full items-center justify-center bg-white p-4">
        <Image
          loading="lazy"
          src={product.image || '/placeholder.png'}
          alt={product.name || product.model || 'Product image'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain"
        />
      </div>

      <div className="flex grow flex-col p-3">
        {showName && <p className="mb-1 line-clamp-1 text-md text-gray-900">{product.name}</p>}

        <p className="mb-2 line-clamp-2 font-extrabold text-gray-800 xl:text-md">{product.model}</p>

        <div className="mt-auto space-y-1">
          <p className="text-gray-900 sm:text-lg xl:text-sm">
            Пара:{' '}
            {product.price_pair !== null ? (
              <span className="text-base font-semibold text-gray-800">{product.price_pair} ₴</span>
            ) : (
              <span className="font-normal text-gray-800 xl:text-sm sm:text-base">За запитом</span>
            )}
          </p>

          <p className="text-gray-900 sm:text-lg xl:text-sm">
            Комплект:{' '}
            {product.price_set !== null ? (
              <span className="text-base font-semibold text-gray-800">{product.price_set} ₴</span>
            ) : (
              <span className="font-normal text-gray-800 xl:text-sm sm:text-base">За запитом</span>
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
