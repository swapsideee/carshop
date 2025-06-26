export const insertReview = `
  INSERT INTO reviews (product_id, rating, comment, created_at)
  VALUES (?, ?, ?, NOW())
`;

export const getLatestReviews = `
  SELECT r.id, r.rating, r.comment, r.created_at, p.model, p.name
  FROM reviews r
  JOIN products p ON r.product_id = p.id
  ORDER BY r.created_at DESC
  LIMIT 20
`;
