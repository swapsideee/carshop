import { describe, expect, it } from 'vitest';

import { formatDateUA } from '@/shared/lib/formatDateUA';

describe('formatDateUA', () => {
  it('returns empty string for invalid date', () => {
    expect(formatDateUA('not-a-date')).toBe('');
    expect(formatDateUA(undefined)).toBe('');
    expect(formatDateUA(null)).toBe('');
  });

  it('formats a valid date to Ukrainian locale string', () => {
    const result = formatDateUA('2024-01-05T12:34:56Z');
    expect(result).toContain('2024');
    expect(result).toContain('05');
  });

  it('accepts Date instance', () => {
    const result = formatDateUA(new Date('2024-06-01T00:00:00Z'));
    expect(result).toContain('2024');
  });
});
