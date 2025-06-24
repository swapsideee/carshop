import { db } from "@/lib/db";
import { insertReview, getLatestReviews } from "@/lib/queries/reviews";
import { ErrorHandler } from '@/lib/utils/errorHandler';

export const POST = ErrorHandler(async (req) => {
    const { productId, rating, comment } = await req.json();

    if (!productId || rating < 1 || rating > 5)
        return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });

    await db.execute(insertReview, [productId, rating, comment]);
    return new Response(null, { status: 201 });
});

export const GET = ErrorHandler(async () => {
    const [rows] = await db.execute(getLatestReviews);
    return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});
