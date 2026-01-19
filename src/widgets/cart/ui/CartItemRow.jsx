'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  errorText,
  hasError,
}) {
  return (
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
              onClick={onDecrement}
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
              onClick={onIncrement}
              aria-label="Increase quantity"
              className="w-9 h-9 shadow-md flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
            >
              <Plus className="w-5 h-5 text-lime-600 cursor-pointer" />
            </button>
          </div>

          {hasError ? <p className="text-sm text-red-600 mt-2 mb-2">{errorText}</p> : null}

          <p className="text-lg font-semibold text-gray-800">
            Цiна: {item.price * item.quantity} ₴
          </p>
        </div>

        <button
          onClick={onRemove}
          aria-label="Remove item"
          className="text-red-500 hover:text-red-700 text-sm flex items-center justify-center xl:mt-10 sm:mt-7 cursor-pointer"
        >
          <Trash2 className="w-9 h-9" />
        </button>
      </div>
    </motion.div>
  );
}
