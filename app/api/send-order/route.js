import { sendOrderEmail } from '@/shared/api/server';
import { ErrorHandler } from '@/shared/lib';

const handler = async (req) => {
  const body = await req.json();

  await sendOrderEmail(body);

  return Response.json({ success: true });
};

export const POST = ErrorHandler(handler);
