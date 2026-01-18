'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, SquareChartGantt, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

import { selectCartItems, selectCartTotal, useCartStore } from '@/features/cart/model';
import PastOrders from '@/widgets/past-orders/ui/PastOrders';

export default function CartPage() {
  const cartItems = useCartStore(selectCartItems);
  const total = useCartStore(selectCartTotal);

  const pastOrders = useCartStore((s) => s.pastOrders);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const [errorItemId, setErrorItemId] = useState(null);
  const [errorText, setErrorText] = useState('');

  const showLineError = useCallback((id, message) => {
    setErrorItemId(id);
    setErrorText(message || 'Помилка');

    window.setTimeout(() => {
      setErrorItemId(null);
      setErrorText('');
    }, 3000);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-10 text-center text-gray-900 flex items-center justify-center gap-2">
        <SquareChartGantt className="flex w-9 h-9 shrink-0 self-start" />
        Обранi товари
      </h1>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xl text-gray-900 space-y-6"
        >
          <p className="mb-30 text-gray-400 text-normal font-semibold">Кошик порожній</p>
          {pastOrders.length > 0 && <PastOrders orders={pastOrders} />}
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-center gap-6 border rounded-lg p-4 shadow-2xl bg-white transition-shadow duration-300"
              >
                <Image
                  src={item.image || '/no-image.png'}
                  alt={item.name || 'Товар'}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover w-32 h-32 border"
                />

                <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>

                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4 mt-4">
                      <button
                        onClick={() => decrement(item.id)}
                        disabled={item.quantity === 1}
                        aria-label="Decrease quantity"
                        className={`shadow-md w-9 h-9 flex items-center justify-center rounded-full transition
                          ${
                            item.quantity === 1
                              ? 'bg-gray-200 cursor-not-allowed opacity-50'
                              : 'bg-gray-100 hover:bg-gray-200 active:scale-95'
                          }`}
                      >
                        <Minus className="w-5 h-5 text-lime-600 cursor-pointer" />
                      </button>

                      <span className="font-bold text-xl text-gray-900">{item.quantity}</span>

                      <button
                        onClick={() => {
                          const res = increment(item.id);
                          if (!res?.ok) showLineError(item.id, res?.message);
                        }}
                        aria-label="Increase quantity"
                        className="w-9 h-9 shadow-md flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
                      >
                        <Plus className="w-5 h-5 text-lime-600 cursor-pointer" />
                      </button>
                    </div>

                    {errorItemId === item.id && (
                      <p className="text-sm text-red-600 mt-2 mb-2">{errorText}</p>
                    )}

                    <p className="text-lg font-semibold text-gray-800">
                      Цiна: {item.price * item.quantity} ₴
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="text-red-500 hover:text-red-700 text-sm flex items-center justify-center xl:mt-10 sm:mt-7 cursor-pointer"
                  >
                    <Trash2 className="w-9 h-9" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-gray-400 pt-6 text-center space-y-6"
          >
            <div className="text-left">
              <p className="text-base text-gray-600 mb-1">
                <span className="text-gray-900">Сума замовлення</span> (Вартість доставки
                розраховується менеджером
                <span className="text-red-500 ml-0.5">*</span>):{' '}
              </p>
              <p className="text-3xl font-bold text-gray-900">{total} ₴</p>
            </div>

            <motion.div className="border-t pt-6 border-gray-400" />

            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => clearCart()}
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
        </div>
      )}
    </div>
  );
}
