import { motion } from 'framer-motion';
import Link from 'next/link';

import type { SaveOrderInput } from '@/features/cart';

type CheckoutSuccessProps = {
  order: SaveOrderInput;
};

export default function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-md shadow-2xl p-6 space-y-6 text-gray-800">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center">
            Дякуємо! Підтвердження вже у вас на пошті. Чекайте на дзвінок або повідомлення від
            нашого менеджера 📩
          </h2>
        </div>

        <div className="text-sm space-y-1">
          <p>
            <strong>Ім&apos;я:</strong> {order.name}
          </p>
          <p>
            <strong>Телефон:</strong> {order.phone}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Коментар:</strong> {order.comment || <span className="text-gray-400">-</span>}
          </p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t" />

        <ul className="text-sm space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="grid grid-cols-[1fr_auto] gap-4 items-start">
              <span>
                {item.name} {item.quantity} шт.
              </span>
              <span className="text-gray-900 font-semibold text-right min-w-15">
                {item.price * item.quantity} ₴
              </span>
            </li>
          ))}
        </ul>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t" />

        <div className="text-right font-bold text-xl text-gray-900">Всього: {order.total} ₴</div>

        <Link
          href="/cart"
          className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition"
        >
          Переглянути замовлення
        </Link>
      </div>
    </div>
  );
}
