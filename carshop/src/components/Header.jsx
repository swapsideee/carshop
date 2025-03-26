"use client";

import Link from "next/link";
import { ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-lime-600 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link href="/"><h1 className="text-2xl font-bold text-gray-900">
        CarShop
      </h1> </Link>
      <nav className="flex items-center space-x-4">
        <Link href="/products" className="text-gray-900 hover:text-green-100 transition-colors duration-300">
          Каталог
        </Link>
        <Link href="/contacts" className="text-gray-900 hover:text-green-100 transition-colors duration-300">
          Контакт
        </Link>
        <Link href="/reviews" className="text-gray-900 hover:text-green-100 transition-colors duration-300">
          Відгуки
        </Link>
        <Link href="/cart">
  <div className="flex items-center space-x-2  text-gray-900 hover:text-green-100 transition-colors duration-300 cursor-pointer">
    <span>Кошик</span>
    <ShoppingCart className="w-5 h-5" />
  </div>
</Link>
      </nav>
    </header>
  );
}