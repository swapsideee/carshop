import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  getProductDetailsById,
  parseProductId,
  toProductDetailApiDTO,
} from '@/entities/product/server';
import { ErrorHandler, HttpError } from '@/shared/lib';

type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

const getProductHandler = async (
  _request: NextRequest,
  { params }: ProductRouteContext,
): Promise<Response> => {
  const { id } = await params;
  const productId = parseProductId(id);
  const product = await getProductDetailsById(productId);

  if (!product) throw new HttpError(404, 'Product not found');

  return NextResponse.json(toProductDetailApiDTO(product));
};

export const GET = ErrorHandler(getProductHandler);
