"use client";

const CompanyCard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 cursor-default">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl p-10 space-y-8">
        <div className="space-y-4">
          <h2 className="text-center text-3xl font-bold text-gray-800">
            Контактна інформація
          </h2>
          <p className="text-lg text-gray-700">
            <span className="font-medium">Електронна пошта:</span>{" "}
            <a
              href="mailto:Vadi-Avto@ukr.net"
              className="text-gray-700 underline hover:text-gray-500"
            >
              Vadi-Avto@ukr.net
            </a>
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium">Мобільний телефон:</span>{" "}
            <a
              href="tel:+380961365299"
              className="text-gray-700 underline hover:text-gray-500"
            >
              +38 096 136 5299
            </a>
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium">Адреса:</span> Авторинок "Лоск", 13
            ряд, 9 місце
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium">Місто:</span> Харків
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium">Години роботи:</span> Пн–Нд,
            9:00–13:00
          </p>
        </div>

        <div className="w-full h-72 sm:h-80 rounded-lg overflow-hidden">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2565.2493535821866!2d36.124826115715536!3d49.9701940794211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41279f5fa4a55557%3A0x444a88900a51d144!2z0JDQstGC0L7QutCw0YDQvtCyINCf0YDQtdC90YLRgNC-0Lkg0JvQvtCz0LTQsNGC0LXRgdC60LjQuSDQstC10YDRjNC60LAg0LrQvtCz0LTQsA!5e0!3m2!1suk!2sde!4v1718474344135!5m2!1suk!2sde"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
