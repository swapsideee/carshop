export default function Home() {
    return (
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold mb-4">Магазин подкрылков CarShop</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          У нас вы найдете подкрылки для более чем 249 моделей автомобилей. Быстрая доставка, качественные товары и отличная поддержка!
        </p>
        <div className="mt-8">
          <a
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Перейти в каталог
          </a>
        </div>
      </section>
    );
  }
  