import { getDB } from '@/lib/db';
import {
  getReviewsAvgByProduct,
  getReviewsCount,
  getReviewsCountByProduct,
  getReviewsPage,
  getReviewsPageByProduct,
  insertReview,
} from '@/lib/queries/reviews';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export const POST = ErrorHandler(async (req) => {
  const { productId, rating, comment, authorName } = await req.json();

  const pid = Number(productId);
  const r = Number(rating);

  if (!Number.isFinite(pid) || pid <= 0 || !Number.isFinite(r) || r < 1 || r > 5) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }

  const name = (authorName || '').trim().slice(0, 60) || null;
  const text = (comment || '').trim().slice(0, 1000) || null;

  const db = await getDB();
  await db.execute(insertReview, [pid, r, name, text]);

  return new Response(null, { status: 201 });
});

export const GET = ErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url);

  const productIdRaw = searchParams.get('productId');
  const productId = productIdRaw ? Number(productIdRaw) : null;

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const limitRaw = Number(searchParams.get('limit')) || 10;
  const limit = Math.min(Math.max(limitRaw, 5), 50);
  const offset = (page - 1) * limit;

  const db = await getDB();

  if (productId !== null) {
    if (!Number.isFinite(productId) || productId <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid productId' }), { status: 400 });
    }

    const [[countRow]] = await db.query(getReviewsCountByProduct, [productId]);
    const total = Number(countRow?.total) || 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const [[avgRow]] = await db.query(getReviewsAvgByProduct, [productId]);
    const avgRating = Number(avgRow?.avgRating) || 0;

    const [rows] = await db.query(getReviewsPageByProduct, [productId, limit, offset]);

    return Response.json({ items: rows, total, totalPages, page, limit, avgRating });
  }

  const [[countRow]] = await db.query(getReviewsCount);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const [rows] = await db.query(getReviewsPage, [offset, limit]);

  return Response.json({ items: rows, total, totalPages, page, limit });
});
