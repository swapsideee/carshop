export default function Bunner() {
  const products = [
    { id: 1, image: "/Bodya.png", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ БОГДАН"},
    { id: 2, image: "/Zaz.jpg", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ ЗАЗ"},
    { id: 3, image: "/Vaz.jpg",  name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ ВАЗ"},
    { id: 4, image: "/Gaz.webp",  name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ ГАЗ"},
    { id: 5, image: "/Uaz.jpg",  name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ УАЗ"},
    { id: 6, image: "/Moskvych.webp",  name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ МОСКВИЧ"},
    { id: 7, image: "/Audi.webp",  name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ AUDI"},
    { id: 8, image: "/Bmw.webp",  name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ BMW"},
    { id: 9, image: "/Byd.webp",  name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ BYD"},
    { id: 10, image: "/Cherry.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ CHERY"},
    { id: 11, image: "/Chevrolet.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ CHEVROLET"},
    { id: 12, image: "/Citroen.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ CITROEN"},
    { id: 13, image: "/Dacia.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ DACIA"},
    { id: 14, image: "/Daewoo.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ DAEWOO"},
    { id: 15, image: "/Fiat.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ FIAT"},
    { id: 16, image: "/Ford.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ FORD"},
    { id: 17, image: "/Geely.jpg", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ GEELY"},
    { id: 18, image: "/GreatWall.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ GREAT WALL"},
    { id: 19, image: "/Hyundai.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ HYUNDAI"},
    { id: 20, image: "/Honda.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ HONDA"},
    { id: 21, image: "/Ikco.png", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ IRAN KHODRO"},
    { id: 22, image: "/Jac.png", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ JAC"},
    { id: 23, image: "/Cherry.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ JAGGI"},
    { id: 24, image: "/Kia.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ KIA"},
    { id: 25, image: "/Lada-Logo.png", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ LADA"},
    { id: 26, image: "/Lexus.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ LEXUS"},
    { id: 27, image: "/Mazda.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ MAZDA"},
    { id: 28, image: "/Mercedes.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ MERCEDES"},
    { id: 29, image: "/Mitsubishi.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ MITSUBISHI"},
    { id: 30, image: "/Nissan.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ NISSAN"},
    { id: 31, image: "/Opel.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ OPEL"},
    { id: 32, image: "/Ravon.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ RAVON"},
    { id: 33, image: "/Renault.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ RENAULT"},
    { id: 34, image: "/Saipa.png", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ SAIPA"},
    { id: 35, image: "/Skoda.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ SKODA"},
    { id: 36, image: "/Subaru.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ SUBARU"},
    { id: 37, image: "/Suzuki.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ SUZUKI"},
    { id: 38, image: "/Toyota.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ TOYOTA"},
    { id: 39, image: "/Volkswagen.webp", name:"ПІДКРИЛКИ ДЛЯ АВТОМОБІЛІВ VOLKSWAGEN"},
  ];

  return (
    <div className="mt-14 flex justify-center ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-30 max-w-7xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full  object-contain p-4"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-black whitespace-nowrap text-sm font-semibold">
            {product.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

