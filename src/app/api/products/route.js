import { getProductsPaged } from '@/entities/product';
import { ErrorHandler } from '@/shared/lib';

export const GET = ErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url);

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 24, 1), 60);

  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '';
  const sortBy = searchParams.get('sort_by') || 'price_pair';
  const q = searchParams.get('q') || '';

  const data = await getProductsPaged({
    brand,
    q,
    sortBy,
    sortOrder: sort === 'desc' ? 'DESC' : 'ASC',
    limit,
    page,
  });

  return Response.json(data);
});
