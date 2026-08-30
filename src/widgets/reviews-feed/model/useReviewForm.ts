import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { getProductsForSelect, type ProductSelectApiDTO } from '@/entities/product';
import { createReview, type CreateReviewApiInput } from '@/entities/review';

export const REVIEW_FORM_MAX_COMMENT = 500;

type RatingValue = 1 | 2 | 3 | 4 | 5;
export type ReviewFormRating = 0 | RatingValue;

export type UseReviewFormOptions = {
  onNewReview?: () => void;
};

export type UseReviewFormResult = {
  products: ProductSelectApiDTO[];
  productId: string;
  authorName: string;
  comment: string;
  submitted: boolean;
  error: string;
  isPosting: boolean;
  activeRating: ReviewFormRating;
  canSubmit: boolean;
  setProductId: (value: string) => void;
  setAuthorName: (value: string) => void;
  setRating: (value: ReviewFormRating) => void;
  setHoverRating: (value: ReviewFormRating) => void;
  setComment: (value: string) => void;
  clearHoverRating: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function useReviewForm({ onNewReview }: UseReviewFormOptions = {}): UseReviewFormResult {
  const [products, setProducts] = useState<ProductSelectApiDTO[]>([]);
  const [productId, setProductId] = useState('');
  const [authorName, setAuthorName] = useState('');

  const [rating, setRating] = useState<ReviewFormRating>(0);
  const [hoverRating, setHoverRating] = useState<ReviewFormRating>(0);

  const [comment, setCommentValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const activeRating = hoverRating || rating;

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async (): Promise<void> => {
      try {
        const data = await getProductsForSelect();
        const items = Array.isArray(data?.items) ? data.items : [];

        if (!cancelled) setProducts(items);
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

  const setComment = (value: string): void => {
    setCommentValue(value.slice(0, REVIEW_FORM_MAX_COMMENT));
  };

  const clearHoverRating = (): void => {
    setHoverRating(0);
  };

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
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

      await createReview(requestBody);

      setProductId('');
      setAuthorName('');
      setRating(0);
      setHoverRating(0);
      setCommentValue('');
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

  return {
    products,
    productId,
    authorName,
    comment,
    submitted,
    error,
    isPosting,
    activeRating,
    canSubmit,
    setProductId,
    setAuthorName,
    setRating,
    setHoverRating,
    setComment,
    clearHoverRating,
    submit,
  };
}
