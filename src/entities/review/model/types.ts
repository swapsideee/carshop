export type Review = {
  id: number;
  product_id: number;
  rating: number;
  author_name: string;
  comment: string;
  created_at: string;
  [key: string]: unknown;
};

export type ReviewFeedItem = {
  id: number;
  rating: number;
  author_name: string;
  comment: string;
  created_at: string;
  model?: string | null;
  name?: string | null;
  [key: string]: unknown;
};

export type ReviewsPageResult<TItem = Review> = {
  items: TItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type ReviewsByProductResult = ReviewsPageResult<Review> & {
  avgRating: number;
};

export type CreateReviewInput = {
  productId: number;
  rating: number;
  authorName: string;
  comment: string;
};
