import { z } from 'zod';

import { HttpError } from './httpError';

/**
 * Converts untrusted HTTP input into a typed value without exposing schema
 * internals or submitted values in a client-facing error.
 */
export function parseRequestSchema<TOutput>(
  schema: z.ZodType<TOutput>,
  source: unknown,
  message: string,
): TOutput {
  const result = schema.safeParse(source);

  if (result.success) return result.data;

  throw new HttpError(400, message);
}
