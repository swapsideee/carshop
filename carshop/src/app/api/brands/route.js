import { db } from '@/lib/db';
import { getAllBrands } from '@/lib/queries/brands';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export const GET = ErrorHandler(async () => {
    const [rows] = await db.query(getAllBrands);
    return Response.json(rows);
});
