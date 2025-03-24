export default function Bunner () {
    const products = [
    { id: 1, name: "Podkrilka", image: "/Podkrilka.jpg", price: "1000₴" },
    { id: 2, name: "Подкрылок B", image: "/B.jpg", price: "1₴" },
    { id: 3, name: "Подкрылок C", image: "/C.jpg", price: "1₴" },
    { id: 4, name: "Подкрылок D", image: "/D.jpg", price: "1₴" },
  ];
    return (

<div className="mt-6 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
            <img src={product.image} alt={product.name} className="w-full h-50 object-cover rounded-xl" />
            <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </div>
        ))}
      </div>
    </div>

    );
}


