import 'server-only';

import { getDB } from '@/shared/db';

import {
  getReviewsAvgByProductQuery,
  getReviewsCountByProductQuery,
  getReviewsCountQuery,
  getReviewsPageByProductQuery,
  getReviewsPageQuery,
  insertReviewQuery,
} from './queries';

export async function createReview({ productId, rating, authorName, comment }) {
  const db = await getDB();
  await db.execute(insertReviewQuery, [productId, rating, authorName, comment]);
}

export async function getReviewsByProduct({ productId, page = 1, limit = 10 }) {
  const db = await getDB();

  const safePage = Math.max(Number(page) || 1, 1);
  const rawLimit = Number(limit) || 10;
  const safeLimit = Math.min(Math.max(rawLimit, 5), 50);
  const offset = (safePage - 1) * safeLimit;

  const [[countRow]] = await db.query(getReviewsCountByProductQuery, [productId]);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

  const [[avgRow]] = await db.query(getReviewsAvgByProductQuery, [productId]);
  const avgRating = Number(avgRow?.avgRating) || 0;

  const [items] = await db.query(getReviewsPageByProductQuery, [productId, safeLimit, offset]);

  return { items, total, totalPages, page: safePage, limit: safeLimit, avgRating };
}

export async function getReviewsFeed({ page = 1, limit = 10 }) {
  const db = await getDB();

  const safePage = Math.max(Number(page) || 1, 1);
  const rawLimit = Number(limit) || 10;
  const safeLimit = Math.min(Math.max(rawLimit, 5), 50);
  const offset = (safePage - 1) * safeLimit;

  const [[countRow]] = await db.query(getReviewsCountQuery);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

  const [items] = await db.query(getReviewsPageQuery, [offset, safeLimit]);

  return { items, total, totalPages, page: safePage, limit: safeLimit };
}
