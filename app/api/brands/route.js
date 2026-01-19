import { getAllBrands } from '@/entities/brand/server';
import { ErrorHandler } from '@/shared/lib';

export const GET = ErrorHandler(async () => {
  const rows = await getAllBrands();
  return Response.json(rows);
});
