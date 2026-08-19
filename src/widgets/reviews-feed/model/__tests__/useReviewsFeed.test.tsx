import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReviewFeedItemApiDTO, ReviewsPageApiResult } from '@/entities/review';

import { useReviewsFeed } from '../useReviewsFeed';

const fetchMock = vi.fn<typeof fetch>();

function createReview(overrides: Partial<ReviewFeedItemApiDTO> = {}): ReviewFeedItemApiDTO {
  return {
    id: 1,
    rating: 5,
    author_name: 'Reviewer',
    comment: 'Review comment',
    created_at: '2026-01-01T00:00:00.000Z',
    model: 'Product model',
    name: 'Product name',
    ...overrides,
  };
}

function createResult(
  overrides: Partial<ReviewsPageApiResult<ReviewFeedItemApiDTO>> = {},
): ReviewsPageApiResult<ReviewFeedItemApiDTO> {
  return {
    items: [],
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 5,
    ...overrides,
  };
}

function createResponse(result: ReviewsPageApiResult<ReviewFeedItemApiDTO>): Response {
  return new Response(JSON.stringify(result), { status: 200 });
}

describe('useReviewsFeed', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('appends the next global feed page with the existing request shape', async () => {
    const firstReview = createReview({ id: 1 });
    const secondReview = createReview({ id: 2 });

    fetchMock
      .mockResolvedValueOnce(
        createResponse(createResult({ items: [firstReview], total: 2, totalPages: 2, limit: 1 })),
      )
      .mockResolvedValueOnce(
        createResponse(
          createResult({ items: [secondReview], page: 2, total: 2, totalPages: 2, limit: 1 }),
        ),
      );

    const { result } = renderHook(() => useReviewsFeed({ limit: 1 }));

    await waitFor(() => expect(result.current.items).toEqual([firstReview]));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items).toEqual([firstReview, secondReview]);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/reviews?page=1&limit=1',
      expect.objectContaining({ cache: 'no-store', signal: expect.any(AbortSignal) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/reviews?page=2&limit=1',
      expect.objectContaining({ cache: 'no-store', signal: expect.any(AbortSignal) }),
    );
  });

  it('resets the initial feed after a non-abort refresh error', async () => {
    const review = createReview();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    fetchMock
      .mockResolvedValueOnce(createResponse(createResult({ items: [review], total: 1 })))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));

    const { result } = renderHook(() => useReviewsFeed());

    await waitFor(() => expect(result.current.items).toEqual([review]));

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.loading).toBe(false);
  });

  it('aborts the in-flight request when the hook unmounts', async () => {
    let signal: AbortSignal | null | undefined;

    fetchMock.mockImplementation((_input, init) => {
      signal = init?.signal;

      return new Promise<Response>(() => {});
    });

    const { unmount } = renderHook(() => useReviewsFeed());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    unmount();

    expect(signal?.aborted).toBe(true);
  });
});
