import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ErrorHandler } from "@/lib/utils/errorHandler";
import { getProductById } from "@/lib/queries/products";

async function getProductHandler(request, context) {
  const id = (await context.params).id;

  const { query, params } = getProductById(id);
  const result = await db.query(query, params);

  const product = Array.isArray(result)
    ? Array.isArray(result[0])
      ? result[0][0]
      : result[0]
    : result;

  if (!product) {
    return new NextResponse("Product not found", { status: 404 });
  }

  return NextResponse.json(product);
}

export const GET = ErrorHandler(getProductHandler);
