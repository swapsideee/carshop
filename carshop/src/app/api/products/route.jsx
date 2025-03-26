import { db } from "@/lib/db";
import "dotenv/config";

export async function GET()
{
    try
    {
        const [rows] = await db.query("SELECT * FROM products");
        return new Response(JSON.stringify(rows), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    catch (e)
    {
        console.error("DB error:", e);
        return new Response(JSON.stringify({ error: "DB error" }), { status: 500,}); 
    }
}