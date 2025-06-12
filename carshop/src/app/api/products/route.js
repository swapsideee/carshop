import { db } from '@/lib/db';

export async function GET(req) 
{
    const { searchParams } = new URL(req.url);
    const brandSlug = searchParams.get('brand_slug');

    try 
    {
        let query = 'SELECT * FROM products';
        const params = [];

        if (brandSlug) 
        {
            query += ' WHERE brand_slug = ? ORDER BY model ASC';
            params.push(brandSlug);
        }

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
