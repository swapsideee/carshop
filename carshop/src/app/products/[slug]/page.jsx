import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default async function ProductPage({ params }) {
  const { slug } = params;

  const res = await fetch(`http://localhost:3000/api/products?brand=${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return notFound();

  const products = await res.json();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Моделі бренду {slug.toUpperCase()}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
