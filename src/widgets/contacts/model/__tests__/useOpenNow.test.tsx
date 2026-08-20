import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isOpenNow } from '@/shared/lib';

import { useOpenNow } from '../useOpenNow';

vi.mock('@/shared/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/lib')>();

  return {
    ...actual,
    isOpenNow: vi.fn(),
  };
});

const isOpenNowMock = vi.mocked(isOpenNow);

describe('useOpenNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-20T12:34:56.789Z'));
    isOpenNowMock.mockReset();
    isOpenNowMock.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('runs the existing initial update, aligns to the next minute, and then updates each minute', () => {
    const { result, unmount } = renderHook(() => useOpenNow());

    expect(result.current).toBe(true);
    expect(isOpenNowMock).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(1);

    isOpenNowMock.mockClear();

    act(() => {
      vi.advanceTimersByTime(3210);
    });
    expect(isOpenNowMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(isOpenNowMock).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(isOpenNowMock).toHaveBeenCalledTimes(2);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('cleans up the pending minute-alignment timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = renderHook(() => useOpenNow());

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
