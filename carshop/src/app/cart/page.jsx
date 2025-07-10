"use client";
import { useState } from "react";
import useCartStore from "@/app/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import PastOrders from "@/components/PastOrders";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, Plus, Minus, Trash2 } from "lucide-react";
export default function CartPage() {
  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    pastOrders,
  } = useCartStore();

  const [errorItemId, setErrorItemId] = useState(null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto cursor-default">
      <h1 className="text-3xl font-extrabold mb-10 text-center text-gray-900 flex items-center justify-center gap-2 cursor-default">
        Обранi товари
        <ShoppingBasket className="w-10 h-10 hidden sm:block" />
      </h1>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xl text-gray-900 space-y-6"
        >
          <p className="mb-15 text-gray-400">Ви не обрали жодного товару </p>

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
                className="flex flex-col md:flex-row items-center gap-6 border rounded-2xl p-4 shadow-2xl bg-white transition-shadow duration-300 cursor-default"
              >
                <Image
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover w-32 h-32 border"
                />

                <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-900">
                      {item.name}
                    </h2>

                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4 mt-4">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="shadow-md w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
                      >
                        <Minus className="w-5 h-5 text-lime-600 cursor-pointer" />
                      </button>

                      <span className="font-bold text-xl text-gray-900">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          if (item.quantity >= 10 ) {
                            setErrorItemId(item.id);
                            setTimeout(() => setErrorItemId(null), 3000);
                          } else {
                            addToCart(item);
                            setErrorItemId(null);
                          }
                        }}
                        className="w-9 h-9 shadow-md flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
                      >
                        <Plus className="w-5 h-5 text-lime-600 cursor-pointer" />
                      </button>
                    </div>
                    {errorItemId === item.id && (
                      <p className="text-sm text-red-600 mt-2 mb-2">
                        Максимум 10 одиниць цього товару !
                      </p>
                    )}
                    <p className="text-lg font-semibold text-gray-800">
                      Цiна: {item.price * item.quantity} грн
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center justify-center mt-10 cursor-pointer"
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
            className="border-t pt-8 text-center space-y-6"
          >
            <div className="text-left">
              <p className="text-base text-gray-600 mb-1">
                <span className="text-gray-900">Сума замовлення</span> (Вартість
                доставки розраховується менеджером
                <span className="text-red-500 ml-0.5">*</span>):{" "}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {total} грн
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t pt-8 text-center space-y-6"
            ></motion.div>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={handleClearCart}
                className="px-6 py-3 text-sm font-semibold text-red-600 border  border-red-500 rounded-xl hover:bg-red-50 transition duration-200 cursor-pointer"
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
