import { NextResponse } from 'next/server';

import { getProductDetailsById } from '@/entities/product';
import { ErrorHandler } from '@/shared/lib';

async function getProductHandler(request, context) {
  const id = (await context.params).id;

  const product = await getProductDetailsById(id);

  if (!product) return new NextResponse('Product not found', { status: 404 });

  return NextResponse.json(product);
}

export const GET = ErrorHandler(getProductHandler);
