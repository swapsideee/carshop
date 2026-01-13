import { getDB } from '@/lib/db';
import { getAllBrands } from '@/lib/queries/brands';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export const GET = ErrorHandler(async () => {
  const db = await getDB();
  console.log('[API] Connection to the database was successful');

  const [rows] = await db.query(getAllBrands);
  console.log('[API] query result:', rows);

  return Response.json(rows);
});
