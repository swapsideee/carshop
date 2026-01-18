import 'server-only';

import { getDB } from '@/shared/db';

import {
  buildProductByIdQuery,
  buildProductImagesQuery,
  buildProductsPagedQueries,
  buildRelatedProductsQuery,
} from './queries';

export async function getProductsPaged({
  brand,
  q,
  sortBy = 'price_pair',
  sortOrder = 'ASC',
  limit = 24,
  page = 1,
}) {
  const db = await getDB();

  const { itemsQuery, itemsParams, countQuery, countParams } = buildProductsPagedQueries({
    brand,
    q,
    sortBy,
    sortOrder,
    limit,
    page,
  });

  const [[countRow]] = await db.query(countQuery, countParams);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const [items] = await db.query(itemsQuery, itemsParams);

  return { items, page, total, totalPages };
}

export async function getProductDetailsById(id) {
  const db = await getDB();

  const { query, params } = buildProductByIdQuery(id);
  const result = await db.query(query, params);
  const product = result?.[0]?.[0] ?? null;

  if (!product) return null;

  const { query: imagesQuery, params: imagesParams } = buildProductImagesQuery(id);
  const [imageRows] = await db.query(imagesQuery, imagesParams);
  product.images = (imageRows || []).map((row) => row.image_url);

  const baseDigits = product.model?.match?.(/\d+/)?.[0] || '';
  const { query: relatedQuery, params: relatedParams } = buildRelatedProductsQuery({
    brandId: product.brand_id,
    modelDigits: baseDigits,
    excludeId: id,
  });

  const [relatedRows] = await db.query(relatedQuery, relatedParams);
  product.related = relatedRows || [];

  return product;
}
