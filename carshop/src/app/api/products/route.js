import { db } from '@/lib/db';

export async function GET(req) 
{
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort') ?? 'asc';
    const sortBy = searchParams.get('sort_by') ?? 'price_pair'; 

    try 
    {
        let query = 'SELECT * FROM products';
        const params = [];

        if (brand) 
        {
            query += ' WHERE brand_slug = ?';
            params.push(brand);
        }

        const validSortColumns = ['price_pair', 'model'];
        const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'price_pair';
        const safeSortOrder = sort === 'desc' ? 'DESC' : 'ASC';

        query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

        const [rows] = await db.query(query, params);
        return Response.json(rows);
    }
    catch (err) 
    {
        console.error('DB error:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
            status: 500,
        });
    }
}
