'use client';

import { motion } from 'framer-motion';

export default function CheckoutForm({ cartItems, total, form, onChange, onSubmit, isSubmitting }) {
  const safeItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-6 space-y-6">
        <h1 className="text-center gap-2 text-3xl font-bold text-gray-900 mb-6 mt-2">
          Заповніть форму для замовлення
        </h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t" />

        <ul className="space-y-2 text-gray-800 text-sm">
          {safeItems.map((item, idx) => {
            const name = item?.name ?? 'Товар';
            const qty = Number(item?.quantity ?? 1);
            const price = Number(item?.price ?? 0);
            const lineTotal = price * qty;

            const key = item?.id ? String(item.id) : `${name}-${idx}`;

            return (
              <li key={key} className="grid grid-cols-[1fr_auto] gap-4 items-start">
                <span>
                  {name} {qty} шт.
                </span>
                <span className="text-gray-900 font-semibold text-right min-w-15">
                  {lineTotal} ₴
                </span>
              </li>
            );
          })}
        </ul>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t" />

        <div className="text-right font-base text-xl text-gray-900">
          Всього до сплати{' '}
          <span className="text-gray-600 text-lg">
            (без вартостi доставки<span className="text-red-500 ml-0.5">*</span>):{' '}
          </span>
          <span className="font-bold">{total} ₴</span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" aria-busy={isSubmitting}>
          <input
            required
            type="text"
            name="name"
            placeholder="Введіть ваше ім’я*"
            value={form.name}
            onChange={onChange}
            disabled={isSubmitting}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition disabled:opacity-70"
          />

          <input
            required
            type="tel"
            name="phone"
            placeholder="Номер телефону*"
            value={form.phone}
            onChange={onChange}
            disabled={isSubmitting}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition disabled:opacity-70"
          />

          <input
            required
            type="email"
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={onChange}
            disabled={isSubmitting}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition disabled:opacity-70"
          />

          <textarea
            name="comment"
            placeholder="Коментар до замовлення (необов’язково)"
            value={form.comment}
            onChange={onChange}
            disabled={isSubmitting}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition min-h-25 disabled:opacity-70"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className={`cursor-pointer w-full text-white font-semibold py-3 rounded-xl transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-lime-600 hover:bg-lime-700 transition duration-200 shadow-md'
            }`}
          >
            {isSubmitting ? 'Переходимо до оплати...' : 'Оплатити карткою (Stripe test)'}
          </button>

          <div className="text-sm text-gray-600">
            Після натискання ви будете перенаправлені на сторінку Stripe Checkout (test mode). Лист
            про замовлення надсилається після підтвердження оплати.
          </div>
        </form>
      </div>
    </div>
  );
}
