import { db } from "@/lib/db";

export async function GET() 
{
  try 
  {
    const [rows] = await db.query(`
      SELECT id, name, rating, comments, created_at 
      FROM reviews 
      WHERE status = 'approved' 
      ORDER BY created_at DESC
    `);
    
    return new Response(JSON.stringify(rows), 
    {
      headers: { "Content-Type": "application/json" },
    });
  } 
  catch (error) 
  {
    console.error("Error fetching reviews:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), 
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) 
{
  try 
  {
    const body = await req.json();
    const { name, rating, comment } = body;

    if (!name || !rating || !comment) 
    {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await db.query(
      "INSERT INTO reviews (name, rating, comments, status) VALUES (?, ?, ?, ?)",
      [name, rating, comment, "pending"]
    );

    return new Response(
      JSON.stringify({ message: "Review added for moderation" }), 
      { 
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } 
  catch (error) 
  {
    console.error("Error adding review:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add review" }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
