import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  const { slug } = params;

  const res = await fetch(
    `http://localhost:3000/api/products?brand_slug=${slug}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return notFound();

  const products = await res.json();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Моделі бренду {slug.toUpperCase()}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
          >
            <div className="w-full h-40 flex items-center justify-center mb-4">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="max-h-full object-contain"
              />
            </div>
            <p className="font-semibold text-lg">{product.model}</p>
            <p className="text-sm text-gray-600">{product.name}</p>
            <p className="mt-2 text-sm">
              Пара: {product.price_pair ?? "—"} грн
            </p>
            <p className="text-sm">Комплект: {product.price_set ?? "—"} грн</p>
          </div>
        ))}
      </div>
    </div>
  );
}
