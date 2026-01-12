export const getAllProducts = ({ brand, sortBy = 'price_pair', sortOrder = 'ASC' }) => {
  const validSortColumns = ['price_pair', 'model'];
  const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'price_pair';
  const safeSortOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';

  let query = 'SELECT * FROM products';
  const params = [];

  if (brand) {
    query += ' WHERE brand_slug = ?';
    params.push(brand);
  }

  query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

  return { query, params };
};

export const getProductById = (id) => ({
  query: 'SELECT * FROM products WHERE id = ?',
  params: [id],
});

export const getProductImages = (productId) => ({
  query: 'SELECT image_url FROM product_images WHERE product_id = ?',
  params: [productId],
});

export const getRelatedProducts = ({ brandId, modelDigits, excludeId }) => ({
  query: `
    SELECT id, model, image, price_pair, price_set
    FROM products
    WHERE brand_id = ? AND model LIKE ? AND id != ?
    LIMIT 4
  `,
  params: [brandId, `%${modelDigits}%`, excludeId],
});
