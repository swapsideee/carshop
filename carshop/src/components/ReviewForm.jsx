"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ReviewForm() 
{
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try 
    {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) 
      {
        setSubmitStatus({ type: "success", message: "Дякуємо за ваш відгук! Він буде опублікований після модерації." });
        setFormData({ name: "", rating: 0, comment: "" });
      } 
      else 
      {
        setSubmitStatus({ type: "error", message: data.error || "Щось пішло не так. Спробуйте ще раз." });
      }
    } 
    catch (error) 
    {
      setSubmitStatus({ type: "error", message: "Помилка при відправці відгуку. Спробуйте ще раз." });
    } 
    finally 
    {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-indigo-100"
    >
      <h2 className="text-2xl font-bold text-black mb-6">Залишити відгук</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
            Ваше ім'я
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Оцінка
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="text-2xl focus:outline-none"
              >
                <span className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <input type="hidden" value={formData.rating} required />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-black mb-2">
            Ваш відгук
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        {submitStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-lg ${
              submitStatus.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {submitStatus.message}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            isSubmitting
              ? "bg-black cursor-not-allowed"
              : "bg-lime-600 "
          } transition-colors duration-200`}
        >
          {isSubmitting ? "Відправка..." : "Відправити відгук"}
        </button>
      </form>
    </motion.div>
  );
} 