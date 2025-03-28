import { db } from "@/lib/db";

export default async function BrandPage({ params }) 
{
  const { brand } = await params;

  const [products] = await db.query
  (
    "SELECT * FROM products WHERE brand_slug = ?",
    [brand]
  );

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold mb-6">
        Підкрилки для {brand.toUpperCase()}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => 
        (
          <div
            key={product.id}
            className="border rounded-lg shadow p-4 text-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain mb-2"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm">
              Пара: {product.price_pair} грн <br />
              Комплект: {product.price_set} грн
            </p>
          </div>
        ))}

        {products.length === 0 && 
        (
          <p className="text-gray-500">
            Наразі немає товарів для цього бренду.
          </p>
        )}
      </div>
    </section>
  );
}
