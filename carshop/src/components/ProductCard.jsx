import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, clickable = false }) {
  const showName = product.name && product.name !== product.model;

  const content = (
    <div
      className={
        'flex flex-col outline-1 outline-gray-300 bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 h-full' +
        (clickable ? ' cursor-pointer' : '')
      }
    >
      <div className="relative w-full aspect-square bg-white flex items-center justify-center p-4">
        <Image
          loading="lazy"
          src={product.image || '/placeholder.png'}
          alt={product.name || product.model || 'Product image'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain"
        />
      </div>

      <div className="p-3 flex flex-col grow">
        {showName && <p className="text-md text-gray-900 mb-1 line-clamp-1">{product.name}</p>}

        <p className="xl:text-md font-extrabold text-gray-800 mb-2 line-clamp-2">{product.model}</p>

        <div className="mt-auto space-y-1">
          <p className="sm:text-lg xl:text-sm text-gray-900">
            Пара:{' '}
            {product.price_pair !== null ? (
              <span className="text-gray-800 font-semibold text-base">{product.price_pair} ₴</span>
            ) : (
              <span className="text-gray-800 font-normal xl:text-sm sm:text-base">За запитом</span>
            )}
          </p>

          <p className="sm:text-lg xl:text-sm text-gray-900">
            Комплект:{' '}
            {product.price_set !== null ? (
              <span className="text-gray-800 font-semibold text-base">{product.price_set} ₴</span>
            ) : (
              <span className="text-gray-800 font-normal xl:text-sm sm:text-base">За запитом</span>
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
