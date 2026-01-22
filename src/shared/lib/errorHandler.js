import { NextResponse } from 'next/server';

import { HttpError } from './httpError';

export function ErrorHandler(handler) {
  return async function (request, context) {
    try {
      return await handler(request, context);
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;

      console.error('API Error:', {
        message: err?.message,
        name: err?.name,
        status,
        stack: err?.stack,
      });

      return NextResponse.json(
        { ok: false, message: err?.message || 'Internal server error' },
        { status },
      );
    }
  };
}
