import 'server-only';

import type { ProductSortBy, SortOrder } from '../../model/types';

export type ProductsPagedQueryArgs = {
  brand?: string;
  q?: string;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  limit?: number;
  page?: number;
};

export type BuiltPagedQueries = {
  itemsQuery: string;
  itemsParams: Array<string | number>;
  countQuery: string;
  countParams: Array<string | number>;
};

export const buildProductsPagedQueries = ({
  brand,
  q,
  sortBy = 'price_pair',
  sortOrder = 'ASC',
  limit = 24,
  page = 1,
}: ProductsPagedQueryArgs): BuiltPagedQueries => {
  const validSortColumns: ProductSortBy[] = ['price_pair', 'model'];
  const safeSortBy: ProductSortBy = validSortColumns.includes(sortBy) ? sortBy : 'price_pair';
  const safeSortOrder: SortOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';

  const where: string[] = [];
  const params: Array<string | number> = [];

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

  const safeLimit = Number(limit);
  const safePage = Number(page);
  const offset = (Math.max(safePage, 1) - 1) * safeLimit;

  const countQuery = `SELECT COUNT(*) as total FROM products${whereSql}`;
  const countParams = [...params];

  const itemsQuery = `SELECT * FROM products${whereSql} ORDER BY ${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`;
  const itemsParams = [...params, safeLimit, Number(offset)];

  return { itemsQuery, itemsParams, countQuery, countParams };
};

export const buildProductByIdQuery = (id: number) => ({
  query: 'SELECT * FROM products WHERE id = ?',
  params: [id],
});

export const buildProductImagesQuery = (productId: number) => ({
  query: 'SELECT image_url FROM product_images WHERE product_id = ?',
  params: [productId],
});

export type RelatedProductsArgs = {
  brandId: number;
  modelDigits: string;
  excludeId: number;
};

export const buildRelatedProductsQuery = ({
  brandId,
  modelDigits,
  excludeId,
}: RelatedProductsArgs) => ({
  query: `
    SELECT id, model, image, price_pair, price_set
    FROM products
    WHERE brand_id = ? AND model LIKE ? AND id != ?
    LIMIT 4
  `,
  params: [brandId, `%${modelDigits}%`, excludeId],
});
