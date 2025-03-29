"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

export default function ReviewsPage() 
{
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Відгуки наших клієнтів</h1>
          <p className="text-black max-w-2xl mx-auto">
            Ми цінуємо вашу думку! Діліться своїми враженнями про наші товари та допомагайте іншим клієнтам зробити правильний вибір.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-lime-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-lime-600 transition-colors duration-200"
          >
            {showForm ? "Сховати форму" : "Залишити відгук"}
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
          >
            <ReviewForm />
          </motion.div>
        )}

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-black text-center mb-8">
            Всі відгуки
          </h2>
          <ReviewList />
        </div>
      </div>
    </section>
  );
} 