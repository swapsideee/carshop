import { sendOrderEmail } from '@/shared/api/server';
import { ErrorHandler, HttpError } from '@/shared/lib';

const handler = async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) throw new HttpError(400, 'Invalid JSON');

  await sendOrderEmail(body);

  return Response.json({ ok: true });
};

export const POST = ErrorHandler(handler);
