import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { HttpError } from './httpError';

type RouteHandler<TContext = unknown> = (
  request: NextRequest,
  context: TContext,
) => Promise<Response>;

export function ErrorHandler<TContext = unknown>(handler: RouteHandler<TContext>) {
  return async function (request: NextRequest, context: TContext) {
    try {
      return await handler(request, context);
    } catch (err: unknown) {
      const status = err instanceof HttpError ? err.status : 500;

      const message = err instanceof Error ? err.message : 'Internal server error';

      console.error('API Error:', {
        message,
        name: err instanceof Error ? err.name : 'UnknownError',
        status,
        stack: err instanceof Error ? err.stack : undefined,
      });

      return NextResponse.json({ ok: false, message }, { status });
    }
  };
}
