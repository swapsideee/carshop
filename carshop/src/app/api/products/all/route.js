import { db } from '@/lib/db';

export async function GET(req) 
{
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') ?? 'asc';
    const brand = searchParams.get('brand');

    try 
    {
        let query = 'SELECT * FROM products';
        const params = [];

        if (brand) 
        {
            query += ' WHERE brand_slug = ?';
            params.push(brand);
        }

        if (sort === 'asc') 
        {
            query += ' ORDER BY price_pair ASC';
        } 
        else if (sort === 'desc') 
        {
            query += ' ORDER BY price_pair DESC';
        }

        const [rows] = await db.query(query, params);
        return Response.json(rows);
    }
    catch (err) 
    {
        console.error('DB error:', err);
        return new Response(JSON.stringify({ error: 'Fetch error' }), { status: 500 });
    }
}
