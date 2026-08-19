import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  getProductsForSelect,
  getProductsPaged,
  parseProductsRequest,
  toProductSelectApiResult,
  toProductsPagedApiResult,
} from '@/entities/product/server';
import { ErrorHandler } from '@/shared/lib';

export const GET = ErrorHandler(async (request: NextRequest) => {
  const query = parseProductsRequest(request.nextUrl.searchParams);

  if (query.kind === 'select') {
    const items = await getProductsForSelect(query);

    return NextResponse.json(toProductSelectApiResult(items));
  }

  const products = await getProductsPaged(query);

  return NextResponse.json(toProductsPagedApiResult(products));
});
