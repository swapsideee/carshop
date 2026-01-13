'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lime-600 shadow-md text-gray-900 mt-16 py-6 text-center text-sm">
      <p>@ {year} PLAST-AVTO. Усі права захищені.</p>
      <p className="mt-1">
        Зв&apos;язок:{' '}
        <a href="mailto:Vadi-Avto@ukr.net" className="text-gray-900 hover:text-gray-700">
          example@gmail.com
        </a>{' '}
        | Тел:{' '}
        <a href="tel:+381234567899" className="text-gray-900 hover:text-gray-700">
          +38 123 456 7899
        </a>
      </p>
    </footer>
  );
}
