"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ReviewList() 
{
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => 
  {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => 
      {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => 
      {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  }, []);

  if (loading) 
  {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-indigo-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-indigo-900">{review.name}</h3>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`text-xl ${
                    index < review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600">{review.comments}</p>
          <div className="mt-4 text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString('uk-UA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </motion.div>
      ))}

      {reviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm border border-indigo-100"
        >
          <p className="text-black text-lg font-medium">Поки що немає відгуків</p>
          <p className="text-black text-sm mt-2">Будьте першим, хто залишить відгук!</p>
        </motion.div>
      )}
    </div>
  );
} 