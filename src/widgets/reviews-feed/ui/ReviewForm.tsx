import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';

import type { ProductSelectApiDTO, ProductSelectApiResult } from '@/entities/product';
import type { CreateReviewApiInput } from '@/entities/review';

const MAX_COMMENT = 500;
const RATING_VALUES = [1, 2, 3, 4, 5] as const;

type RatingValue = (typeof RATING_VALUES)[number];
type Rating = 0 | RatingValue;

type RatingStarProps = {
  filled: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  size?: number;
  title: string;
};

type ReviewFormProps = {
  onNewReview?: () => void;
};

function getProductLabel(product: ProductSelectApiDTO): string {
  const { name, model } = product;

  if (name && name !== model) return `${name} ${model}`;

  return model ?? '';
}

function getLegacyTotalPages(response: ProductSelectApiResult | null): number {
  if (response === null || !('totalPages' in response)) return 1;

  return Number(response.totalPages) || 1;
}

function RatingStar({ filled, onClick, onMouseEnter, size = 20, title }: RatingStarProps) {
  const titleAttributes = { title };

  return (
    <svg
      {...titleAttributes}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? '#84cc16' : 'none'}
      stroke="#84cc16"
      strokeWidth="1.5"
      className="cursor-pointer"
      style={{ width: size, height: size }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.208 3.708a1 1 0 00.95.69h3.905c.969 0 1.371 1.24.588 1.81l-3.158 2.294a1 1 0 00-.363 1.118l1.208 3.708c.3.921-.755 1.688-1.538 1.118L12 13.347l-3.158 2.294c-.783.57-1.838-.197-1.538-1.118l1.208-3.708a1 1 0 00-.363-1.118L4.99 9.135c-.783-.57-.38-1.81.588-1.81h3.905c.426 0 .802-.274.95-.69l1.208-3.708z"
      />
    </svg>
  );
}

export default function ReviewForm({ onNewReview }: ReviewFormProps) {
  const [products, setProducts] = useState<ProductSelectApiDTO[]>([]);
  const [productId, setProductId] = useState('');
  const [authorName, setAuthorName] = useState('');

  const [rating, setRating] = useState<Rating>(0);
  const [hoverRating, setHoverRating] = useState<Rating>(0);

  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const activeRating = hoverRating || rating;

  const ratingLabel =
    activeRating === 1
      ? 'Погано'
      : activeRating === 2
        ? 'Так собі'
        : activeRating === 3
          ? 'Нормально'
          : activeRating === 4
            ? 'Добре'
            : activeRating === 5
              ? 'Чудово'
              : '';

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async (): Promise<void> => {
      try {
        let page = 1;
        let totalPages = 1;
        const all: ProductSelectApiDTO[] = [];

        while (!cancelled && page <= totalPages) {
          const response = await fetch('/api/products?forSelect=1', { cache: 'no-store' });
          if (!response.ok) break;

          const data: ProductSelectApiResult | null = await response.json();
          const items = Array.isArray(data?.items) ? data.items : [];

          all.push(...items);

          totalPages = getLegacyTotalPages(data);
          page += 1;

          if (page > 100) break;
        }

        if (!cancelled) setProducts(all);
      } catch {
        if (!cancelled) setProducts([]);
      }
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return (
      Boolean(productId) &&
      Boolean(authorName.trim()) &&
      Boolean(comment.trim()) &&
      rating > 0 &&
      !isPosting
    );
  }, [productId, authorName, comment, rating, isPosting]);

  const handleAuthorNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setAuthorName(event.target.value);
  };

  const handleProductChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setProductId(event.target.value);
  };

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setComment(event.target.value.slice(0, MAX_COMMENT));
  };

  const handleRatingMouseLeave = (): void => {
    setHoverRating(0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');

    if (!productId) return setError('Будь ласка, оберіть товар');
    if (!authorName.trim()) return setError("Будь ласка, введіть ім'я");
    if (rating === 0) return setError('Будь ласка, поставте оцiнку');

    if (!comment.trim()) return setError('Будь ласка, введіть коментар');

    setIsPosting(true);

    try {
      const requestBody: CreateReviewApiInput = {
        productId,
        rating,
        comment: comment.trim(),
        authorName: authorName.trim(),
      };
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`POST /api/reviews failed: ${response.status}`);

      setProductId('');
      setAuthorName('');
      setRating(0);
      setHoverRating(0);
      setComment('');
      setSubmitted(true);

      onNewReview?.();
      setTimeout(() => setSubmitted(false), 2500);
    } catch (caughtError: unknown) {
      console.error(caughtError);
      setError('Сталася помилка під час надсилання відгуку.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Залишити відгук</h2>
        <p className="mt-1 text-sm text-gray-600">
          Оберіть товар, поставте оцінку та додайте коментар (за бажанням).
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Ваше ім&apos;я</label>
          <input
            value={authorName}
            onChange={handleAuthorNameChange}
            placeholder="Наприклад, Ірина"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-600"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Товар</label>
          <select
            value={productId}
            onChange={handleProductChange}
            className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-600"
          >
            <option value="">Оберіть товар</option>

            {products.map((product) => {
              const label = getProductLabel(product);
              return (
                <option key={product.id} value={product.id} title={label}>
                  {label.length > 42 ? label.slice(0, 42) + '...' : label}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Оцінка</label>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" onMouseLeave={handleRatingMouseLeave}>
              {RATING_VALUES.map((value) => (
                <RatingStar
                  key={value}
                  filled={value <= activeRating}
                  onMouseEnter={() => setHoverRating(value)}
                  onClick={() => setRating(value)}
                  title={`${value} / 5`}
                />
              ))}
            </div>

            {activeRating > 0 ? (
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">{activeRating} / 5</span>{' '}
                <span className="text-gray-400">•</span> <span>{ratingLabel}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-400">Оберіть оцінку</div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">
            Коментар <span className="text-gray-400 font-normal">(обов&apos;язково)</span>
          </label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            rows={4}
            required
            placeholder="Ваш відгук"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-600"
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {comment.length}/{MAX_COMMENT}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={[
            'w-full rounded-xl px-4 py-2.5 text-base font-semibold transition',
            canSubmit
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed',
          ].join(' ')}
        >
          {isPosting ? 'Надсилаємо…' : 'Надіслати відгук'}
        </button>

        {submitted ? (
          <p className="text-center text-green-700 font-medium">Дякуємо за відгук!</p>
        ) : null}
        {error ? <p className="text-center text-red-600 font-medium">{error}</p> : null}
      </form>
    </div>
  );
}
