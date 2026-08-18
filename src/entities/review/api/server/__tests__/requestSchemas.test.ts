import { describe, expect, it } from 'vitest';

import { HttpError } from '@/shared/lib';

import { parseCreateReviewInput, parseReviewsRequest } from '../requestSchemas';

describe('review request schemas', () => {
  it('preserves anonymous authors while normalizing valid review input', () => {
    expect(
      parseCreateReviewInput({
        productId: '42',
        rating: '5',
        authorName: '   ',
        comment: '  Fits perfectly  ',
      }),
    ).toEqual({
      productId: 42,
      rating: 5,
      authorName: null,
      comment: 'Fits perfectly',
    });
  });

  it('rejects an empty review comment instead of converting it to null', () => {
    expect(() => parseCreateReviewInput({ productId: 42, rating: 5, comment: '   ' })).toThrow(
      HttpError,
    );
    expect(() => parseCreateReviewInput({ productId: 42, rating: 5, comment: '   ' })).toThrow(
      'Invalid review input',
    );
  });

  it('normalizes by-product review pagination and validates its bounds', () => {
    expect(
      parseReviewsRequest(new URLSearchParams({ productId: '42', page: '2', limit: '25' })),
    ).toEqual({ kind: 'byProduct', productId: 42, page: 2, limit: 25 });

    expect(() => parseReviewsRequest(new URLSearchParams({ page: '0' }))).toThrow(
      'Invalid reviews query',
    );
  });
});
