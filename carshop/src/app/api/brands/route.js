import { getDB } from '@/lib/db';
import { getAllBrands } from '@/lib/queries/brands';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export const GET = ErrorHandler(async () => {
    const db = await getDB();
    console.log('[API] подключение к БД прошло');

    const [rows] = await db.query(getAllBrands);
    console.log('[API] результат запроса:', rows);

    return Response.json(rows);
});

