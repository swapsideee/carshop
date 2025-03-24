"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-gray-800">
        CarShop
      </h1>
      <nav className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
          Главная
        </Link>
        <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
          Каталог
        </Link>
        <Link href="/contacts" className="text-gray-700 hover:text-blue-600 transition">
          Контакты
        </Link>
        <Link href="/reviews" className="text-gray-700 hover:text-blue-600 transition">
          Отзывы
        </Link>
      </nav>
    </header>
  );
}
