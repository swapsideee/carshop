import { createReview, getReviewsByProduct, getReviewsFeed } from '@/entities/review';
import { ErrorHandler } from '@/shared/lib';

export const POST = ErrorHandler(async (req) => {
  const { productId, rating, comment, authorName } = await req.json();

  const pid = Number(productId);
  const r = Number(rating);

  if (!Number.isFinite(pid) || pid <= 0 || !Number.isFinite(r) || r < 1 || r > 5) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }

  const name = (authorName || '').trim().slice(0, 60) || null;
  const text = (comment || '').trim().slice(0, 1000) || null;

  await createReview({ productId: pid, rating: r, authorName: name, comment: text });

  return new Response(null, { status: 201 });
});

export const GET = ErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url);

  const productIdRaw = searchParams.get('productId');
  const productId = productIdRaw ? Number(productIdRaw) : null;

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const limit = Number(searchParams.get('limit')) || 10;

  if (productId !== null) {
    if (!Number.isFinite(productId) || productId <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid productId' }), { status: 400 });
    }

    const data = await getReviewsByProduct({ productId, page, limit });
    return Response.json(data);
  }

  const data = await getReviewsFeed({ page, limit });
  return Response.json(data);
});
