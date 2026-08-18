import 'server-only';

import type { RowDataPacket } from 'mysql2/promise';

import { getDB } from '@/shared/db';
import type { ProductRow } from '@/shared/db/schema';

import type {
  CheckoutProduct,
  ProductDetailDTO,
  ProductSelectItemDTO,
  ProductSortBy,
  ProductsPagedResultDTO,
  SortOrder,
} from '../../model/types';
import {
  type CheckoutProductRow,
  mapCheckoutProductRow,
  mapProductDetail,
  mapProductRow,
  mapProductSelectRow,
  type ProductImageUrlRow,
  type ProductSelectRow,
  type RelatedProductRow,
} from './mappers';
import {
  buildProductByIdQuery,
  buildProductImagesQuery,
  buildProductsForCheckoutQuery,
  buildProductsForSelectQuery,
  buildProductsPagedQueries,
  buildRelatedProductsQuery,
  type ProductsPagedQueryArgs,
} from './queries';

type CountRow = RowDataPacket & { total?: number | string | null };
type ImageRow = RowDataPacket & ProductImageUrlRow;
type RelatedRow = RowDataPacket & RelatedProductRow;
type CheckoutRow = RowDataPacket & CheckoutProductRow;
type SelectRow = RowDataPacket & ProductSelectRow;

export type GetProductsPagedArgs = ProductsPagedQueryArgs;

export async function getProductsPaged({
  brand,
  q,
  sortBy = 'price_pair',
  sortOrder = 'ASC',
  limit = 24,
  page = 1,
}: GetProductsPagedArgs = {}): Promise<ProductsPagedResultDTO> {
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

  return { items: items.map(mapProductRow), page: Number(page), total, totalPages };
}

export async function getProductDetailsById(id: number): Promise<ProductDetailDTO | null> {
  const db = await getDB();

  const { query, params } = buildProductByIdQuery(id);
  const [productRows] = await db.query<ProductRow[]>(query, params);
  const product = productRows?.[0] ?? null;

  if (!product) return null;

  const { query: imagesQuery, params: imagesParams } = buildProductImagesQuery(id);
  const [imageRows] = await db.query<ImageRow[]>(imagesQuery, imagesParams);

  const baseDigits = String(product.model ?? '').match(/\d+/)?.[0] || '';
  const brandId = Number(product.brand_id);

  if (Number.isFinite(brandId) && brandId > 0 && baseDigits) {
    const { query: relatedQuery, params: relatedParams } = buildRelatedProductsQuery({
      brandId,
      modelDigits: baseDigits,
      excludeId: id,
    });

    const [relatedRows] = await db.query<RelatedRow[]>(relatedQuery, relatedParams);
    return mapProductDetail(product, imageRows, relatedRows);
  }

  return mapProductDetail(product, imageRows, []);
}

export async function getProductsForCheckout(productIds: number[]): Promise<CheckoutProduct[]> {
  if (!productIds.length) return [];

  const db = await getDB();
  const { query, params } = buildProductsForCheckoutQuery(productIds);
  const [rows] = await db.query<CheckoutRow[]>(query, params);

  return rows.map(mapCheckoutProductRow);
}

export async function getProductsForSelect({
  brand,
  q,
  limit,
}: {
  brand?: string;
  q?: string;
  limit?: number;
} = {}): Promise<ProductSelectItemDTO[]> {
  const db = await getDB();

  const { query, params } = buildProductsForSelectQuery({ brand, q, limit });
  const [rows] = await db.query<SelectRow[]>(query, params);

  return rows.map(mapProductSelectRow);
}
