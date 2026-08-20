import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCopiedKey } from '../useCopiedKey';

describe('useCopiedKey', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('resets the latest copied key after its own timeout', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCopiedKey());

    act(() => {
      result.current.setCopiedKey('email');
    });
    act(() => {
      vi.advanceTimersByTime(700);
      result.current.setCopiedKey('address');
    });
    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(result.current.copiedKey).toBe('address');

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(result.current.copiedKey).toBe('');
  });

  it('cleans up its pending reset timeout on unmount', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { result, unmount } = renderHook(() => useCopiedKey());

    act(() => {
      result.current.setCopiedKey('address');
    });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
