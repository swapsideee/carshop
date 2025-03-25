import Banner from "@/components/Banner";

export default function Home() {
    return (
      <section className="text-center py-12">
        <h2 className="text-gray-700 text-4xl font-bold mb-4">Автомобільні підкрилки</h2>
        <p className="text-lg text-gray-900 max-w-2xl mx-auto">
        У нас ви знайдете підкрилки для більш ніж 250 моделей автомобілів. Доставка по всій Україні,якісні товари та постійна підтримка!
        </p>
        <div className="mt-10">
          <a
            href="/products"
            className="bg-lime-600 text-gray-900 px-6 py-3 rounded-lg text-lg hover:text-green-100 transition-colors duration-300"
          >
            Перейти до каталогу
          </a>
          <Banner />
        </div>
      </section>
    );
  }
  