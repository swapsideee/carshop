"use client";

import useCartStore from "@/app/store/cartStore";
import Link from "next/link";
import { useState } from "react";
import { validatePhone, validateName } from "@/lib/utils/validator";
import { motion } from "framer-motion";

export default function OrderPage() {
  const { cartItems, clearCart, saveOrder } = useCartStore();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid: phoneValid, cleaned: cleanedPhone } = validatePhone(
      form.phone
    );
    const { isValid: nameValid, cleaned: cleanedName } = validateName(
      form.name
    );

    if (!nameValid) {
      alert("Ім’я повинно містити лише літери");
      return;
    }

    if (!phoneValid) {
      alert("Введіть коректний номер телефону");
      return;
    }

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      alert("Введіть коректний email");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      items: cartItems,
      total,
      name: cleanedName,
      phone: cleanedPhone,
      email: form.email.trim(),
      comment: form.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orderData.name,
          phone: orderData.phone,
          email: orderData.email,
          comment: orderData.comment,
          cartItems,
          total,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Помилка при відправленні листа");
      }

      saveOrder(orderData);
      clearCart();
      setSubmittedOrder(orderData);
      setSubmitted(true);
    } catch (error) {
      console.error("Помилка:", error);
      alert("Сталася помилка при оформленні замовлення. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center font-bold text-gray-900">
          Кошик порожній.{" "}
          <Link href="/products" className="text-lime-600">
            Перейти до товарів
          </Link>
        </div>
      </div>
    );
  }

  if (submitted && submittedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-gray-100 rounded-2xl shadow-2xl p-6 space-y-6 text-gray-800 cursor-default">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center">
              Дякуємо, що обрали нас! Наш менеджер невдовзі зв’яжеться з вами
            </h2>
          </div>

          <div className="text-sm space-y-1">
            <p>
              <strong>Ім'я:</strong> {submittedOrder.name}
            </p>
            <p>
              <strong>Телефон:</strong> {submittedOrder.phone}
            </p>
            <p>
              <strong>Email:</strong> {submittedOrder.email}
            </p>
            <p>
              <strong>Коментар:</strong>{" "}
              {submittedOrder.comment || (
                <span className="text-gray-400">—</span>
              )}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t text-center space-y-6 text-gray-300"
          />

          <ul className="text-sm space-y-2">
            {submittedOrder.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{item.price * item.quantity} грн</span>
              </li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t text-center space-y-6 text-gray-300"
          />

          <div className="text-right font-bold text-lg text-gray-900">
            Всього: {submittedOrder.total} грн
          </div>

          <Link
            href="/products"
            className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition"
          >
            Назад до каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-gray-100 rounded-2xl shadow-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 mt-2">
          Заповніть форму для замовлення
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t text-center space-y-6 text-gray-300"
        />

        <ul className="space-y-2 text-gray-800 text-sm">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span className="text-gray-900 font-semibold">
                {item.price * item.quantity} грн
              </span>
            </li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t text-center space-y-6 text-gray-300"
        />

        <div className="text-right font-base text-xl text-gray-900">
          Всього до сплати{" "}
          <span className="text-gray-600 text-lg">
            (без вартостi доставки*):{" "}
          </span>
          <span className="font-bold">{total} грн</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="text"
            name="name"
            placeholder="Введіть ваше ім’я*"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />
          <input
            required
            type="tel"
            name="phone"
            placeholder="Номер телефону*"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email для підтвердження*"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />
          <textarea
            name="comment"
            placeholder="Коментар до замовлення (необов’язково)"
            value={form.comment}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition min-h-[100px]"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-semibold py-3 rounded-xl transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800 transition duration-200 shadow-md"
            }`}
          >
            {isSubmitting ? "Обробка..." : "Підтвердити замовлення"}
          </button>

          <div className="text-sm text-gray-600">
            Натискаючи «Підтвердити замовлення», ви підтверджуєте, що менеджер
            отримає інформацію про ваше замовлення та зв’яжеться з вами
            найближчим часом для уточнення деталей, доставки й оплати
            <span className="text-red-500 ml-0.5">*</span>
          </div>
        </form>
      </div>
    </div>
  );
}
