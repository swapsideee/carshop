import 'server-only';

export const buildProductsPagedQueries = ({
  brand,
  q,
  sortBy = 'price_pair',
  sortOrder = 'ASC',
  limit = 24,
  page = 1,
}) => {
  const validSortColumns = ['price_pair', 'model'];
  const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'price_pair';
  const safeSortOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';

  const where = [];
  const params = [];

  if (brand) {
    where.push('brand_slug = ?');
    params.push(brand);
  }

  const terms = String(q || '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length) {
    const col = "LOWER(CONCAT_WS(' ', COALESCE(name,''), COALESCE(model,'')))";
    terms.forEach((t) => {
      where.push(`${col} LIKE ?`);
      params.push(`%${t}%`);
    });
  }

  const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';

  const offset = (Math.max(page, 1) - 1) * limit;

  const countQuery = `SELECT COUNT(*) as total FROM products${whereSql}`;
  const countParams = [...params];

  const itemsQuery = `SELECT * FROM products${whereSql} ORDER BY ${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`;
  const itemsParams = [...params, Number(limit), Number(offset)];

  return { itemsQuery, itemsParams, countQuery, countParams };
};

export const buildProductByIdQuery = (id) => ({
  query: 'SELECT * FROM products WHERE id = ?',
  params: [id],
});

export const buildProductImagesQuery = (productId) => ({
  query: 'SELECT image_url FROM product_images WHERE product_id = ?',
  params: [productId],
});

export const buildRelatedProductsQuery = ({ brandId, modelDigits, excludeId }) => ({
  query: `
    SELECT id, model, image, price_pair, price_set
    FROM products
    WHERE brand_id = ? AND model LIKE ? AND id != ?
    LIMIT 4
  `,
  params: [brandId, `%${modelDigits}%`, excludeId],
});
