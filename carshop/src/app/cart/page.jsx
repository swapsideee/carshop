"use client";

import useCartStore from "@/app/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import PastOrders from "@/components/PastOrders";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

export default function CartPage() {
  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    pastOrders,
  } = useCartStore();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleClearCart = () => {
    if (confirm("Очистити кошик?")) clearCart();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900 flex items-center justify-center gap-2">
        <ShoppingCart className="w-8 h-8 text-lime-600" />
        Кошик
      </h1>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 space-y-6"
        >
          <p>
            Ваш кошик порожній.{" "}
            <Link
              href="/products"
              className="text-lime-600 hover:underline font-medium"
            >
              Перейти до каталогу
            </Link>
          </p>

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
                className="flex flex-col md:flex-row items-center gap-6 border rounded-2xl p-4 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover w-32 h-32 border"
                />

                <div className="flex-1 w-full text-center md:text-left">
                  <h2 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Ціна за товар: {item.price} грн
                  </p>

                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
                    >
                      <Minus className="w-5 h-5 text-lime-600" />
                    </button>

                    <span className="font-bold text-xl text-gray-900">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
                    >
                      <Plus className="w-5 h-5 text-lime-600" />
                    </button>
                  </div>

                  <p className="text-lg font-semibold text-gray-800">
                    Разом: {item.price * item.quantity} грн
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm underline"
                  >
                    <Trash2 className="w-4 h-4" />
                    Видалити товар
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t pt-8 text-center space-y-6"
          >
            <div className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Загальна сума: {total} грн
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleClearCart}
                className="bg-white border border-red-500 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 shadow-sm"
              >
                Очистити кошик
              </button>

              <Link
                href="/order"
                className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 shadow-sm"
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
