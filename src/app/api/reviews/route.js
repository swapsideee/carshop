import { getDB } from '@/lib/db';
import { getReviewsCount, getReviewsPage, insertReview } from '@/lib/queries/reviews';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export const POST = ErrorHandler(async (req) => {
  const { productId, rating, comment, authorName } = await req.json();

  if (!productId || rating < 1 || rating > 5)
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });

  const name = (authorName || '').trim() || null;
  const text = (comment || '').trim() || null;

  const db = await getDB();
  await db.execute(insertReview, [productId, rating, name, text]);

  return new Response(null, { status: 201 });
});

export const GET = ErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url);

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const limitRaw = Number(searchParams.get('limit')) || 10;
  const limit = Math.min(Math.max(limitRaw, 5), 50);
  const offset = (page - 1) * limit;

  const db = await getDB();

  const [[countRow]] = await db.query(getReviewsCount);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const [rows] = await db.query(getReviewsPage, [offset, limit]);

  return new Response(
    JSON.stringify({
      items: rows,
      total,
      totalPages,
      page,
      limit,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
