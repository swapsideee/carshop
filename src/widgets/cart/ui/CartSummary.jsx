'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CartSummary({ total, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t border-gray-400 pt-6 text-center space-y-6"
    >
      <div className="text-left">
        <p className="text-base text-gray-600 mb-1">
          <span className="text-gray-900">Сума замовлення</span> (Вартість доставки розраховується
          менеджером
          <span className="text-red-500 ml-0.5">*</span>):{' '}
        </p>
        <p className="text-3xl font-bold text-gray-900">{total} ₴</p>
      </div>

      <motion.div className="border-t pt-6 border-gray-400" />

      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onClear}
          className="px-6 py-3 text-sm font-semibold text-red-600 border border-red-500 rounded-xl hover:bg-red-50 transition duration-200 cursor-pointer"
        >
          Видалити все
        </button>

        <Link
          href="/order"
          className="px-10 py-4 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition duration-200 shadow-md"
        >
          Оформити замовлення
        </Link>
      </div>
    </motion.div>
  );
}
