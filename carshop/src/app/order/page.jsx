"use client";

import useCartStore from "@/app/store/cartStore";
import Link from "next/link";
import { useState } from "react";
import { validatePhone } from "@/lib/utils/validator";

export default function OrderPage() {
  const { cartItems, clearCart, saveOrder } = useCartStore();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedPhone = form.phone.replace(/\s+/g, "");

    const { isValid, cleaned } = validatePhone(form.phone);

    if (!isValid) {
      alert("Введіть коректний номер телефону");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      items: cartItems,
      total,
      name: form.name.trim(),
      phone: cleanedPhone,
      comment: form.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    saveOrder(orderData);
    clearCart();
    setSubmittedOrder(orderData);
    setSubmitted(true);
  };

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="p-6 text-center text-gray-600">
        Кошик порожній.{" "}
        <Link href="/products" className="text-lime-600 hover:underline">
          Перейти до товарів
        </Link>
      </div>
    );
  }

  if (submitted && submittedOrder) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6 text-gray-800">
        <h2 className="text-2xl font-bold text-center text-lime-700">
          ✅ Дякуємо! Ваше замовлення прийнято.
        </h2>

        <div className="text-sm space-y-1">
          <p>
            <strong>Ім'я:</strong> {submittedOrder.name}
          </p>
          <p>
            <strong>Телефон:</strong> {submittedOrder.phone}
          </p>
          <p>
            <strong>Коментар:</strong>{" "}
            {submittedOrder.comment || <span className="text-gray-400">—</span>}
          </p>
        </div>

        <ul className="text-sm border-t pt-4 space-y-2">
          {submittedOrder.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{item.price * item.quantity} грн</span>
            </li>
          ))}
        </ul>

        <div className="text-right font-bold text-lg text-gray-900">
          Всього: {submittedOrder.total} грн
        </div>

        <Link
          href="/products"
          className="block w-full text-center bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Назад до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Оформлення замовлення
        </h1>

        <ul className="space-y-2 text-gray-800 text-sm border-b pb-4">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span className="text-lime-700 font-semibold">
                {item.price * item.quantity} грн
              </span>
            </li>
          ))}
        </ul>

        <div className="text-right font-bold text-lg text-gray-900">
          Всього до сплати: {total} грн
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="text"
            name="name"
            placeholder="Ім'я"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />
          <input
            required
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />
          <textarea
            name="comment"
            placeholder="Коментар до замовлення (необов’язково)"
            value={form.comment}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 transition min-h-[100px]"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-semibold py-3 rounded-xl transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-lime-600 hover:bg-lime-700 active:scale-95"
            }`}
          >
            {isSubmitting ? "Обробка..." : "Підтвердити замовлення"}
          </button>
        </form>
      </div>
    </div>
  );
}
