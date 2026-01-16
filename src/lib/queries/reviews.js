export const insertReview = `
  INSERT INTO reviews (product_id, rating, author_name, comment, created_at)
  VALUES (?, ?, ?, ?, NOW())
`;

export const getReviewsPageByProduct = `
  SELECT id, product_id, rating, author_name, comment, created_at
  FROM reviews
  WHERE product_id = ?
  ORDER BY created_at DESC, id DESC
  LIMIT ? OFFSET ?
`;

export const getReviewsCountByProduct = `
  SELECT COUNT(*) as total
  FROM reviews
  WHERE product_id = ?
`;

export const getReviewsAvgByProduct = `
  SELECT AVG(rating) as avgRating
  FROM reviews
  WHERE product_id = ?
`;

export const getReviewsPage = `
  SELECT r.id, r.rating, r.author_name, r.comment, r.created_at, p.model, p.name
  FROM reviews r
  JOIN products p ON r.product_id = p.id
  ORDER BY r.created_at DESC
  LIMIT ?, ?
`;

export const getReviewsCount = `
  SELECT COUNT(*) as total
  FROM reviews
`;
