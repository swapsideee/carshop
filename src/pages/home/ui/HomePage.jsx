'use client';

import { motion } from 'framer-motion';

import Banner from '@/widgets/layout/banner';

export default function Home() {
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

      <motion.div
        className="text-lg text-gray-900 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="mt-8 rounded-lg shadow-sm py-2 px-2 bg-white">
          <p>
            PLAST-AVTO - надійний інтернет-магазин автозапчастин з досвідом роботи. Пропонуємо
            підкрилки для понад 250 моделей авто за вигідними цінами. Працюємо онлайн та офлайн -
            замовляйте зручно або завітайте до нас особисто у мiстi Харкiв!
          </p>
          <br />
        </div>
      </motion.div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Banner />
      </motion.div>
    </motion.section>
  );
}
