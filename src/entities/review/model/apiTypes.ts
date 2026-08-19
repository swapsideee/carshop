export type ReviewApiDTO = {
  id: number;
  product_id: number;
  rating: number;
  author_name: string | null;
  comment: string;
  created_at: string | null;
};

export type ReviewFeedItemApiDTO = {
  id: number;
  rating: number;
  author_name: string | null;
  comment: string;
  created_at: string | null;
  model: string | null;
  name: string | null;
};

export type CreateReviewApiInput = {
  productId: string;
  rating: number;
  comment: string;
  authorName: string;
};

export type ReviewsPageApiResult<TItem> = {
  items: TItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type ReviewsByProductApiResult = ReviewsPageApiResult<ReviewApiDTO> & {
  avgRating: number;
};
