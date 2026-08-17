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
      const isExpectedClientError =
        err instanceof HttpError &&
        Number.isInteger(err.status) &&
        err.status >= 400 &&
        err.status < 500;
      const status = isExpectedClientError ? err.status : 500;
      const loggedMessage = err instanceof Error ? err.message : 'Internal server error';
      const message = isExpectedClientError ? err.message : 'Internal server error';

      console.error('API Error:', {
        message: loggedMessage,
        name: err instanceof Error ? err.name : 'UnknownError',
        status,
        stack: err instanceof Error ? err.stack : undefined,
      });

      return NextResponse.json({ ok: false, message }, { status });
    }
  };
}
