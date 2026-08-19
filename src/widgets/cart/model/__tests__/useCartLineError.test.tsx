import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCartLineError } from '../useCartLineError';

describe('useCartLineError', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a line error and clears it after the configured timeout', () => {
    const { result } = renderHook(() => useCartLineError({ timeoutMs: 3000 }));

    act(() => {
      result.current.showLineError('42-pair', 'Maximum quantity reached');
    });

    expect(result.current.errorItemId).toBe('42-pair');
    expect(result.current.errorText).toBe('Maximum quantity reached');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.errorItemId).toBeNull();
    expect(result.current.errorText).toBe('');
  });
});
