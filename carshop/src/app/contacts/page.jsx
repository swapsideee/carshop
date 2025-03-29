import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function Contacts() 
{
  return (
    <section className="bg-gray-100 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Зворотній зв'язок
        </h1>

        <div className="flex items-center space-x-3 text-gray-800 mb-4">
          <Phone className="w-6 h-6 text-gray-600" />
          <p className="text-lg">+38 (063) 123 45 67 | Дмитро </p>
        </div>

        <div className="flex items-center space-x-3 text-gray-800 mb-4">
          <Mail className="w-6 h-6 text-gray-600" />
          <a
            href="mailto:Vadi-Avto@ukr.net"
            className="text-lg no-underline hover:text-gray-500 transition"
          >
            Vadi-Avto@ukr.net
          </a>
        </div>

        <div className="flex items-center space-x-3 text-gray-800 mb-4">
          <MapPin className="w-6 h-6 text-gray-600" />
          <p className="text-lg">Харків, авторинок Лоск, 13 ряд, 9 місце</p>
        </div>

        <div className="flex items-center space-x-3 text-gray-800 mb-1">
          <Clock className="w-6 h-6 text-gray-600" />
          <p className="text-lg font-semibold">Графік роботи</p>
        </div>
        <div className="pl-9 text-gray-700 text-base">
          Понеділок – Неділя: 08:00 – 20:00
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-10 rounded-2xl overflow-hidden shadow-md">
        <iframe
          title="Місце розташування"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d999.1002460757736!2d36.12642670974427!3d49.97000339226837!2m3!1f206.6967496084314!2f0!3f0!3m2!1i1024!2i768!4f35!3m3!1m2!1s0x41279f5fa6987927%3A0x2ebe4060abfbe905!2sLosk!5e1!3m2!1sru!2sde!4v1743116112239!5m2!1sru!2sde"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
