export type ReviewDTO = {
  id: number;
  productId: number;
  rating: number;
  authorName: string | null;
  comment: string;
  createdAt: string | null;
};

export type ReviewFeedItemDTO = {
  id: number;
  rating: number;
  authorName: string | null;
  comment: string;
  createdAt: string | null;
  productModel: string | null;
  productName: string | null;
};

export type ReviewsPageResultDTO<TItem> = {
  items: TItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type ReviewsByProductResultDTO = ReviewsPageResultDTO<ReviewDTO> & {
  avgRating: number;
};

export type CreateReviewInput = {
  productId: number;
  rating: number;
  authorName: string | null;
  comment: string;
};
