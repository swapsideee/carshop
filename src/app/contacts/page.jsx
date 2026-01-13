'use client';

import { Building, Clock, Mail, MapPin, Phone } from 'lucide-react';

const CompanyCard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-xl p-10 space-y-8">
        <div className="space-y-4">
          <h2 className="text-center text-3xl font-bold text-gray-800">Контактна інформація</h2>

          <p className="text-lg text-gray-700 flex items-center gap-2">
            <Mail className="w-5 h-5 shrink-0 self-start mt-1" />
            <a
              href="mailto:Vadi-Avto@ukr.net"
              className="text-gray-700 underline hover:text-gray-500"
            >
              example@gmail.com
            </a>
          </p>

          <p className="text-lg text-gray-700 flex items-center gap-2">
            <Phone className="w-5 h-5 shrink-0 self-start mt-1" />
            <a href="tel:+381234567899" className="text-gray-700 underline hover:text-gray-500">
              +38 123 456 7899
            </a>
          </p>

          <p className="text-lg text-gray-700 flex items-center gap-2">
            <MapPin className="w-5 h-5 shrink-0 self-start mt-1" />
            вул. Приблизна, 10
          </p>

          <p className="text-lg text-gray-700 flex items-center gap-2">
            <Building className="w-5 h-5 shrink-0 self-start mt-1" />
            Харків
          </p>

          <p className="text-lg text-gray-700 flex items-center gap-2">
            <Clock className="w-5 h-5 shrink-0 self-start mt-1" />
            Вт–Нд, 9:00–13:00
          </p>
        </div>

        <div className="w-full h-72 sm:h-80 rounded-lg overflow-hidden">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41044.94908353241!2d36.25218043736826!3d49.98681002010195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4127a09f63ab0f8b%3A0x2d4c18681aa4be0a!2z0KXQsNGA0YzQutC-0LIsINCl0LDRgNGM0LrQvtCy0YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsINCj0LrRgNCw0LjQvdCw!5e0!3m2!1sru!2sde!4v1768246895936!5m2!1sru!2sde"
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
