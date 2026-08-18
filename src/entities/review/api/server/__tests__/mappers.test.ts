import { describe, expect, it } from 'vitest';

import type { ReviewRow } from '@/shared/db/schema';

import { mapReviewFeedRow, mapReviewRow } from '../mappers';
import { toReviewsByProductApiResult, toReviewsFeedApiResult } from '../serializers';

describe('review database mappers', () => {
  it('preserves anonymous authors and nullable timestamps in the domain DTO', () => {
    const row = {
      id: 9,
      product_id: 42,
      rating: 5,
      author_name: null,
      comment: '',
      created_at: null,
    } as ReviewRow;

    expect(mapReviewRow(row)).toEqual({
      id: 9,
      productId: 42,
      rating: 5,
      authorName: null,
      comment: '',
      createdAt: null,
    });
  });

  it('serializes database dates and keeps the legacy API representation at the route boundary', () => {
    const review = mapReviewRow({
      id: 9,
      product_id: 42,
      rating: 5,
      author_name: 'Olena',
      comment: 'Great fit',
      created_at: new Date('2026-08-18T12:00:00.000Z'),
    } as ReviewRow);

    expect(
      toReviewsByProductApiResult({
        items: [review],
        total: 1,
        totalPages: 1,
        page: 1,
        limit: 10,
        avgRating: 5,
      }),
    ).toMatchObject({
      items: [
        {
          product_id: 42,
          author_name: 'Olena',
          created_at: '2026-08-18T12:00:00.000Z',
        },
      ],
    });

    expect(
      toReviewsFeedApiResult({
        items: [
          mapReviewFeedRow({
            id: 9,
            rating: 5,
            author_name: 'Olena',
            comment: 'Great fit',
            created_at: new Date('2026-08-18T12:00:00.000Z'),
            model: 'Model X',
            name: 'Brake pads',
          }),
        ],
        total: 1,
        totalPages: 1,
        page: 1,
        limit: 10,
      }).items[0],
    ).toEqual({
      id: 9,
      rating: 5,
      author_name: 'Olena',
      comment: 'Great fit',
      created_at: '2026-08-18T12:00:00.000Z',
      model: 'Model X',
      name: 'Brake pads',
    });
  });
});
