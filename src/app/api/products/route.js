import { getDB } from '@/lib/db';
import { getAllProductsPaged } from '@/lib/queries/products';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export const GET = ErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url);

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 24, 1), 60);

  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '';
  const sortBy = searchParams.get('sort_by') || 'price_pair';
  const q = searchParams.get('q') || '';

  const { itemsQuery, itemsParams, countQuery, countParams } = getAllProductsPaged({
    brand,
    q,
    sortBy,
    sortOrder: sort === 'desc' ? 'DESC' : 'ASC',
    limit,
    page,
  });

  const db = await getDB();

  const [[countRow]] = await db.query(countQuery, countParams);
  const total = Number(countRow?.total) || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const [items] = await db.query(itemsQuery, itemsParams);

  return Response.json({
    items,
    page,
    total,
    totalPages,
  });
});
