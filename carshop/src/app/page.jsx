"use client";

import { motion } from "framer-motion";
import Banner from "@/components/Banner";

export default function Home() 
{
  return (
    <motion.section
      className="text-center py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-gray-700 text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Автомобільні підкрилки
      </motion.h2>
      <motion.p
        className="text-lg text-gray-900 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        У нас ви знайдете підкрилки для більш ніж 250 моделей автомобілів.
        Доставка по всій Україні, якісні товари та постійна підтримка!
      </motion.p>
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <a
          href="/products"
          className="bg-lime-600 text-gray-900 px-6 py-3 rounded-lg text-lg hover:text-green-100 transition-colors duration-300"
        >
          Перейти до каталогу
        </a>
        <Banner />
      </motion.div>
    </motion.section>
  );
}
