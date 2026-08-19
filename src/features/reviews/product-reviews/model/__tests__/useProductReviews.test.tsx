import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getReviews, type ReviewApiDTO, type ReviewsByProductApiResult } from '@/entities/review';

import { useProductReviews } from '../useProductReviews';

vi.mock('@/entities/review', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/review')>();

  return {
    ...actual,
    getReviews: vi.fn(),
  };
});

const getReviewsMock = vi.mocked(getReviews);

function createReview(overrides: Partial<ReviewApiDTO> = {}): ReviewApiDTO {
  return {
    id: 1,
    product_id: 42,
    rating: 5,
    author_name: 'Reviewer',
    comment: 'Review comment',
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function createResult(
  overrides: Partial<ReviewsByProductApiResult> = {},
): ReviewsByProductApiResult {
  return {
    items: [],
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10,
    avgRating: 0,
    ...overrides,
  };
}

describe('useProductReviews', () => {
  beforeEach(() => {
    getReviewsMock.mockReset();
  });

  it('appends a next page without duplicating reviews already loaded', async () => {
    const firstReview = createReview({ id: 1 });
    const secondReview = createReview({ id: 2 });

    getReviewsMock
      .mockResolvedValueOnce(
        createResult({
          items: [firstReview],
          total: 2,
          totalPages: 2,
          avgRating: 4.5,
        }),
      )
      .mockResolvedValueOnce(
        createResult({
          items: [firstReview, secondReview],
          page: 2,
          total: 2,
          totalPages: 2,
          avgRating: 4.5,
        }),
      );

    const { result } = renderHook(() => useProductReviews({ productId: 42, limit: 1 }));

    await waitFor(() => expect(result.current.items).toEqual([firstReview]));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items).toEqual([firstReview, secondReview]);
    expect(result.current.avgRating).toBe(4.5);
    expect(getReviewsMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ productId: 42, page: 1, limit: 1 }),
    );
    expect(getReviewsMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ productId: 42, page: 2, limit: 1 }),
    );
  });

  it('aborts the in-flight request when the hook unmounts', async () => {
    let signal: AbortSignal | undefined;

    getReviewsMock.mockImplementation((params) => {
      signal = params.signal;

      return new Promise(() => {});
    });

    const { unmount } = renderHook(() => useProductReviews({ productId: 42 }));

    await waitFor(() => expect(getReviewsMock).toHaveBeenCalledTimes(1));
    unmount();

    expect(signal?.aborted).toBe(true);
  });
});
