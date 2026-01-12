import { getDB } from '@/lib/db';
import { getAllProducts } from '@/lib/queries/products';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export const GET = ErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get('brand');
  const sort = searchParams.get('sort') ?? 'asc';
  const sortBy = searchParams.get('sort_by') ?? 'price_pair';

  const { query, params } = getAllProducts({
    brand,
    sortBy,
    sortOrder: sort === 'desc' ? 'DESC' : 'ASC',
  });

  const db = await getDB();
  const [rows] = await db.query(query, params);
  return Response.json(rows);
});
