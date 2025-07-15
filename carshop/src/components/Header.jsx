"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Car, Star,Contact,ScrollText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-lime-600 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50"
    >
      <Link href="/" className="group flex items-center gap-2 cursor-pointer">
        <p className="text-gray-900 text-2xl italic font-bold tracking-wider transition-colors duration-300 group-hover:text-lime-400">
          VADI-AVTO
        </p>
        <Car className="w-9 h-9 text-gray-900 transition-colors duration-300 group-hover:text-lime-400" />
      </Link>

      <nav className="hidden md:flex items-center space-x-4">
        <Link
          href="/products"
          className="text-gray-900 hover:text-green-100 transition-colors duration-300"
        >
          Каталог
        </Link>
        <Link
          href="/contacts"
          className="text-gray-900 hover:text-green-100 transition-colors duration-300"
        >
          Зв'язок
        </Link>
        <Link
          href="/reviews"
          className="text-gray-900 hover:text-green-100 transition-colors duration-300"
        >
          Відгуки
        </Link>
        <Link href="/cart">
          <div className="flex items-center text-gray-900 hover:text-green-100 transition-colors duration-300 cursor-pointer">
            Кошик
            <ShoppingCart className="w-5 h-5 ml-1.5" />
          </div>
        </Link>
      </nav>

      <button
        className="md:hidden text-gray-900"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-lime-600 flex flex-col items-start space-y-2 px-6 py-4 shadow-md md:hidden"
          >
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-gray-900 hover:text-green-100 transition-colors duration-300 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <ScrollText className="w-5 h-5"/>
              Каталог
            </Link>
            <Link
              href="/contacts"
              className="flex items-center gap-1.5 text-gray-900 hover:text-green-100 transition-colors duration-300 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <Contact className="w-5 h-5 mb-0.5" />
              Зв'язок
            </Link>
            <Link
              href="/reviews"
              className="flex items-center gap-1.5 text-gray-900 hover:text-green-100 transition-colors duration-300 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <Star className="w-5 h-5 mb-0.5" />
              Відгуки
            </Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>
              <div className="flex items-center gap-1.5 text-gray-900 hover:text-green-100 transition-colors duration-300 cursor-pointer">
                <ShoppingCart className="w-5 h-5 mb-1" />
                <span>Кошик</span>
              </div>
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
