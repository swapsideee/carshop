import { NextResponse } from 'next/server';

import { getAllBrands, toBrandApiDTO } from '@/entities/brand/server';
import { ErrorHandler } from '@/shared/lib';

export const GET = ErrorHandler(async () => {
  const brands = await getAllBrands();

  return NextResponse.json(brands.map(toBrandApiDTO));
});
