import { db } from "@/lib/db";

export async function GET(req) 
{
    const { searchParams } = new URL(req.url);

    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const min = parseFloat(searchParams.get("min")) || 0;
    const max = parseFloat(searchParams.get("max")) || 999999;

    let query = "SELECT * FROM products WHERE price_pair >= ? AND price_pair <= ?";
    let params = [min, max];

    if (brand) 
    {
        query += " AND brand_slug = ?";
        params.push(brand);
    }

    if (model) 
    {
        query += " AND model = ?";
        params.push(model);
    }

    try 
    {
        const [rows] = await db.query(query, params);
        return new Response(JSON.stringify(rows), 
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } 
    catch (err) 
    {
        console.error("Error fetching products", err);
        return new Response(JSON.stringify({ error: "Database error" }), 
        {
            status: 500,
        });
    }
}
