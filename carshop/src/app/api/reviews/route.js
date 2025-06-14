import { db } from "@/lib/db";
import { insertReview, getLatestReviews } from "@/lib/queries/reviews";

export async function POST(req) {
    try {
        const { productId, rating, comment } = await req.json();

        if (!productId || rating < 1 || rating > 5 || comment.length < 3)
            return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });

        await db.execute(insertReview, [productId, rating, comment]);

        return new Response(null, { status: 201 });
    }
    catch (err) {
        console.error("Error saving review:", err);
        return new Response(JSON.stringify({ error: "Failed to save review" }), {
            status: 500,
        });
    }
}

export async function GET() {
    try {
        const [rows] = await db.execute(getLatestReviews);

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (err) {
        console.error("Error fetching reviews:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
            status: 500,
        });
    }
}
