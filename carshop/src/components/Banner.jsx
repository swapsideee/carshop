export default function Bunner() {
  const products = [
    { id: 1, image: "/Podkrilka.jpg"},
    { id: 2, image: "/Podkrilka.jpg"},
    { id: 3, image: "/Podkrilka.jpg"},
    { id: 4, image: "/Podkrilka.jpg"},
  ];

  return (
    <div className="mt-14 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-30 max-w-7xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-700 text-xl font-semibold">
              Переглянути
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

