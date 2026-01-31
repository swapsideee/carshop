import 'server-only';

import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { getDB } from '@/shared/db';

import type {
  CreateReviewInput,
  Review,
  ReviewFeedItem,
  ReviewsByProductResult,
  ReviewsPageResult,
} from '../../model/types';
import {
  getReviewsAvgByProductQuery,
  getReviewsCountByProductQuery,
  getReviewsCountQuery,
  getReviewsPageByProductQuery,
  getReviewsPageQuery,
  insertReviewQuery,
} from './queries';

type CountRow = RowDataPacket & { total?: number | string | null };
type AvgRow = RowDataPacket & { avgRating?: number | string | null };
type ReviewRow = RowDataPacket & Review;
type ReviewFeedRow = RowDataPacket & ReviewFeedItem;

export async function createReview({
  productId,
  rating,
  authorName,
  comment,
}: CreateReviewInput): Promise<void> {
  const db = await getDB();
  await db.execute<ResultSetHeader>(insertReviewQuery, [productId, rating, authorName, comment]);
}

export type GetReviewsByProductArgs = {
  productId: number;
  page?: number;
  limit?: number;
};

export async function getReviewsByProduct({
  productId,
  page = 1,
  limit = 10,
}: GetReviewsByProductArgs): Promise<ReviewsByProductResult> {
  const db = await getDB();

  const safePage = Math.max(Number(page) || 1, 1);
  const rawLimit = Number(limit) || 10;
  const safeLimit = Math.min(Math.max(rawLimit, 5), 50);
  const offset = (safePage - 1) * safeLimit;

  const [[countRow]] = await db.query<CountRow[]>(getReviewsCountByProductQuery, [productId]);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

  const [[avgRow]] = await db.query<AvgRow[]>(getReviewsAvgByProductQuery, [productId]);
  const avgRating = Number(avgRow?.avgRating) || 0;

  const [items] = await db.query<ReviewRow[]>(getReviewsPageByProductQuery, [
    productId,
    safeLimit,
    offset,
  ]);

  return { items, total, totalPages, page: safePage, limit: safeLimit, avgRating };
}

export type GetReviewsFeedArgs = {
  page?: number;
  limit?: number;
};

export async function getReviewsFeed({ page = 1, limit = 10 }: GetReviewsFeedArgs = {}): Promise<
  ReviewsPageResult<ReviewFeedItem>
> {
  const db = await getDB();

  const safePage = Math.max(Number(page) || 1, 1);
  const rawLimit = Number(limit) || 10;
  const safeLimit = Math.min(Math.max(rawLimit, 5), 50);
  const offset = (safePage - 1) * safeLimit;

  const [[countRow]] = await db.query<CountRow[]>(getReviewsCountQuery);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

  const [items] = await db.query<ReviewFeedRow[]>(getReviewsPageQuery, [offset, safeLimit]);

  return { items, total, totalPages, page: safePage, limit: safeLimit };
}
