import { db } from "@/lib/db";
import "dotenv/config";

export async function GET() 
{
  try 
  {
    const [rows] = await db.query("SELECT * FROM brands");
    return new Response(JSON.stringify(rows),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  }
  catch (error) 
  {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error: "Database error" }),
      {
        status: 500,
      });
  }
}