'use client';

import { motion } from 'framer-motion';

export default function CheckoutForm({ cartItems, total, form, onChange, onSubmit, isSubmitting }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-6 space-y-6">
        <h1 className="text-center gap-2 text-3xl font-bold text-gray-900 mb-6 mt-2">
          Заповніть форму для замовлення
        </h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t" />

        <ul className="space-y-2 text-gray-800 text-sm">
          {cartItems.map((item) => (
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

        <div className="text-right font-base text-xl text-gray-900">
          Всього до сплати{' '}
          <span className="text-gray-600 text-lg">
            (без вартостi доставки<span className="text-red-500 ml-0.5">*</span>):{' '}
          </span>
          <span className="font-bold">{total} ₴</span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            type="text"
            name="name"
            placeholder="Введіть ваше ім’я*"
            value={form.name}
            onChange={onChange}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />

          <input
            required
            type="tel"
            name="phone"
            placeholder="Номер телефону*"
            value={form.phone}
            onChange={onChange}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />

          <input
            required
            type="email"
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={onChange}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />

          <textarea
            name="comment"
            placeholder="Коментар до замовлення (необов’язково)"
            value={form.comment}
            onChange={onChange}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition min-h-25"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`cursor-pointer w-full text-white font-semibold py-3 rounded-xl transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800 transition duration-200 shadow-md'
            }`}
          >
            {isSubmitting ? 'Обробка...' : 'Підтвердити замовлення'}
          </button>

          <div className="text-sm text-gray-900">
            Натискаючи «Підтвердити замовлення», ви нічого не сплачуєте - менеджер отримає
            інформацію про ваше замовлення та зв’яжеться з вами найближчим часом для уточнення
            деталей, розрахунку вартості доставки та оплати
            <span className="text-red-500 ml-0.5">*</span>
          </div>
        </form>
      </div>
    </div>
  );
}
