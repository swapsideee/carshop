import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  createReview,
  getReviewsByProduct,
  getReviewsFeed,
  parseCreateReviewInput,
  parseReviewsRequest,
  toReviewsByProductApiResult,
  toReviewsFeedApiResult,
} from '@/entities/review/server';
import { ErrorHandler, HttpError } from '@/shared/lib';

async function readJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }
}

export const POST = ErrorHandler(async (request: NextRequest) => {
  const review = parseCreateReviewInput(await readJsonBody(request));

  await createReview(review);

  return new Response(null, { status: 201 });
});

export const GET = ErrorHandler(async (request: NextRequest) => {
  const query = parseReviewsRequest(request.nextUrl.searchParams);

  if (query.kind === 'byProduct') {
    const reviews = await getReviewsByProduct(query);

    return NextResponse.json(toReviewsByProductApiResult(reviews));
  }

  const reviews = await getReviewsFeed(query);

  return NextResponse.json(toReviewsFeedApiResult(reviews));
});
