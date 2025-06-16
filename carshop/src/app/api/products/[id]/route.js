import { NextResponse } from "next/server";
import { db } from "@/lib/db";


// TODO: rework this function a little later
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const result = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    const product = Array.isArray(result) ? (Array.isArray(result[0]) ? result[0][0] : result[0]) : result;
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Database error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 