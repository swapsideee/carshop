import { afterEach, describe, expect, it, vi } from 'vitest';

import { ErrorHandler, generateOwnerEmailHtml, sanitizeEmailHeader } from '@/shared/lib';
import { HttpError } from '@/shared/lib/httpError';

describe('email output escaping', () => {
  it('escapes user-controlled values in HTML and prevents header line breaks', () => {
    const html = generateOwnerEmailHtml({
      name: '<img src=x onerror=alert(1)>',
      comment: '"<script>alert(1)</script>',
      cartItems: [{ name: '<b>part</b>', quantity: 1, price: 100 }],
    });

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;b&gt;part&lt;/b&gt;');
    expect(sanitizeEmailHeader('Name\r\nBcc: attacker@example.com')).toBe(
      'Name Bcc: attacker@example.com',
    );
  });
});

describe('ErrorHandler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not disclose unexpected server errors to a client', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const handler = ErrorHandler(async () => {
      throw new Error("Unknown column 'secret' in 'field list'");
    });

    const response = await handler(new Request('http://localhost/api/test') as never, undefined);

    await expect(response.json()).resolves.toEqual({ ok: false, message: 'Internal server error' });
  });

  it('does not disclose HttpError messages with a 5xx status', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const handler = ErrorHandler(async () => {
      throw new HttpError(500, 'Internal database topology');
    });

    const response = await handler(new Request('http://localhost/api/test') as never, undefined);

    await expect(response.json()).resolves.toEqual({ ok: false, message: 'Internal server error' });
  });
});
