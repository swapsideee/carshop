import { db } from '@/lib/db';

export async function GET() 
{
    try 
    {
        const [rows] = await db.query('SELECT * FROM brands ORDER BY name ASC');
        return Response.json(rows);
    } 
    catch (err) 
    {
        console.error('DB error:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch brands' }), {
            status: 500,
        });
    }
}
