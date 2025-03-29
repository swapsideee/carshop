import { db } from "@/lib/db";

export async function GET(req) 
{
    try 
    {
        const { searchParams } = new URL(req.url);
        const brand = searchParams.get("brand");

        if (!brand) 
        {
            return new Response(JSON.stringify([]), 
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const [models] = await db.query
        (
            "SELECT DISTINCT model FROM products WHERE brand_slug = ?",
            [brand]
        );

        return new Response(JSON.stringify(models), 
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } 
    catch (err) 
    {
        console.error("API /models error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), 
        {
            status: 500,
        });
    }
}
