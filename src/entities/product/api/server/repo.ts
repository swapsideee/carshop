import 'server-only';

import type { RowDataPacket } from 'mysql2/promise';

import { getDB } from '@/shared/db';

import type {
  Product,
  ProductSortBy,
  ProductsPagedResult,
  RelatedProduct,
  SortOrder,
} from '../../model/types';
import {
  buildProductByIdQuery,
  buildProductImagesQuery,
  buildProductsPagedQueries,
  buildRelatedProductsQuery,
  type ProductsPagedQueryArgs,
} from './queries';

type ProductRow = RowDataPacket & Product;
type CountRow = RowDataPacket & { total?: number | string | null };
type ImageRow = RowDataPacket & { image_url: string };
type RelatedRow = RowDataPacket & RelatedProduct;

export type GetProductsPagedArgs = ProductsPagedQueryArgs;

export async function getProductsPaged({
  brand,
  q,
  sortBy = 'price_pair',
  sortOrder = 'ASC',
  limit = 24,
  page = 1,
}: GetProductsPagedArgs = {}): Promise<ProductsPagedResult> {
  const db = await getDB();

  const { itemsQuery, itemsParams, countQuery, countParams } = buildProductsPagedQueries({
    brand,
    q,
    sortBy: sortBy as ProductSortBy,
    sortOrder: sortOrder as SortOrder,
    limit,
    page,
  });

  const [[countRow]] = await db.query<CountRow[]>(countQuery, countParams);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(1, Math.ceil(total / Number(limit)));

  const [items] = await db.query<ProductRow[]>(itemsQuery, itemsParams);

  return { items, page: Number(page), total, totalPages };
}

export async function getProductDetailsById(id: number): Promise<ProductRow | null> {
  const db = await getDB();

  const { query, params } = buildProductByIdQuery(id);
  const [productRows] = await db.query<ProductRow[]>(query, params);
  const product = productRows?.[0] ?? null;

  if (!product) return null;

  const { query: imagesQuery, params: imagesParams } = buildProductImagesQuery(id);
  const [imageRows] = await db.query<ImageRow[]>(imagesQuery, imagesParams);
  product.images = (imageRows || []).map((row) => row.image_url);

  const baseDigits = String(product.model ?? '').match(/\d+/)?.[0] || '';
  const brandId = Number(product.brand_id);

  if (Number.isFinite(brandId) && brandId > 0 && baseDigits) {
    const { query: relatedQuery, params: relatedParams } = buildRelatedProductsQuery({
      brandId,
      modelDigits: baseDigits,
      excludeId: id,
    });

    const [relatedRows] = await db.query<RelatedRow[]>(relatedQuery, relatedParams);
    product.related = relatedRows || [];
  } else {
    product.related = [];
  }

  return product;
}
