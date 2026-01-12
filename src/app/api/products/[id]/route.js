import { NextResponse } from 'next/server';

import { getDB } from '@/lib/db';
import { getProductById, getProductImages, getRelatedProducts } from '@/lib/queries/products';
import { ErrorHandler } from '@/lib/utils/errorHandler';

async function getProductHandler(request, context) {
  const id = (await context.params).id;

  const db = await getDB();

  const { query, params } = getProductById(id);
  const result = await db.query(query, params);

  const product = Array.isArray(result)
    ? Array.isArray(result[0])
      ? result[0][0]
      : result[0]
    : result;

  if (!product) return new NextResponse('Product not found', { status: 404 });

  const { query: imagesQuery, params: imagesParams } = getProductImages(id);
  const imagesRes = await db.query(imagesQuery, imagesParams);
  const images = imagesRes[0].map((row) => row.image_url);
  product.images = images;

  const baseDigits = product.model.match(/\d+/)?.[0] || '';
  const { query: relatedQuery, params: relatedParams } = getRelatedProducts({
    brandId: product.brand_id,
    modelDigits: baseDigits,
    excludeId: id,
  });
  const relatedRes = await db.query(relatedQuery, relatedParams);
  product.related = relatedRes[0];

  return NextResponse.json(product);
}

export const GET = ErrorHandler(getProductHandler);
