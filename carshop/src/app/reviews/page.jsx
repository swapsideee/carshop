"use client";
import { useState, useEffect } from "react";
function Star({ filled, onClick }) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "#84cc16" : "none"}
      stroke="#84cc16"
      strokeWidth="1.5"
      className="w-5 h-5 cursor-pointer"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.208 3.708a1 1 0 00.95.69h3.905c.969 0 1.371 1.24.588 1.81l-3.158 2.294a1 1 0 00-.363 1.118l1.208 3.708c.3.921-.755 1.688-1.538 1.118L12 13.347l-3.158 2.294c-.783.57-1.838-.197-1.538-1.118l1.208-3.708a1 1 0 00-.363-1.118L4.99 9.135c-.783-.57-.38-1.81.588-1.81h3.905a1 1 0 00.95-.69l1.208-3.708z"
      />
    </svg>
  );
}

function ReviewForm({ onNewReview }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!productId && rating === 0) {
      setError("Будь ласка, оберiть товар i поставте оцiнку");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!productId) {
      setError("Будь ласка, оберіть товар");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (rating === 0) {
      setError("Будь ласка, поставте оцiнку");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      setProductId("");
      setRating(0);
      setComment("");
      setSubmitted(true);
      setError("");
      onNewReview();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError("Сталася помилка під час надсилання відгуку.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 text-base text-gray-700 font-medium">
          Пошук
        </label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="cursor-pointer w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-lime-600 shadow-sm"
        >
          <option value="">Оберіть товар</option>
          {products.map((p) => {
            const label =
              p.name && p.name !== p.model ? `${p.name} ${p.model}` : p.model;
            return (
              <option key={p.id} value={p.id} title={label}>
                {label.length > 30 ? label.slice(0, 30) + "..." : label}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-base text-gray-700 font-medium">
          Оцінка
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              filled={num <= rating}
              onClick={() => setRating(num)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-base text-gray-700 font-medium">
          Коментар (необов'язково)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          placeholder="Ваш відгук"
          className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 ring-lime-600 shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer text-white font-semibold bg-gray-900 hover:bg-gray-800 py-2.5 rounded-md transition text-base"
      >
        Надіслати відгук
      </button>

      {submitted && (
        <p className="text-center text-green-700 font-medium cursor-default">
          Дякуємо за відгук!
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 font-medium">{error}</p>  
      )}
    </form>
  );
}

function ReviewList({ refresh }) {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = () => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch((err) => console.error("Error loading reviews:", err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (refresh) fetchReviews();
  }, [refresh]);

  return (
    <div className="space-y-4 pt-8 cursor-default">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Останні відгуки
      </h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">Відгуків ще немає</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-900 font-medium">
                {r.name && r.name !== r.model
                  ? `${r.name} ${r.model}`
                  : r.model}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(r.created_at).toLocaleDateString("uk-UA")}
              </span>
            </div>
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} filled={n <= r.rating} />
              ))}
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleNewReview = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-xl p-10 space-y-10">
        <div>
          <h1 className="flex justify-center items-center text-3xl font-bold text-center text-gray-800 mb-6 cursor-default gap-1.5">
            Залишити відгук
          </h1>
          <ReviewForm onNewReview={handleNewReview} />
        </div>
        <ReviewList refresh={refreshFlag} />
      </div>
    </div>
  );
}
