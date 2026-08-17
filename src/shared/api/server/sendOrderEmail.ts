import 'server-only';

import nodemailer from 'nodemailer';

import type { EmailCartItem, OrderEmailBody } from '@/shared/lib';
import { generateClientEmailHtml, generateOwnerEmailHtml, sanitizeEmailHeader } from '@/shared/lib';

type SendOrderEmailBody = OrderEmailBody & {
  name: string;
  phone: string;
  cartItems: EmailCartItem[];
};

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  throw new Error('Missing EMAIL_USER / EMAIL_PASS env vars');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

function validateRequestBody(body: unknown): asserts body is SendOrderEmailBody {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Невалідні дані замовлення');
  }

  const b = body as Partial<SendOrderEmailBody>;

  if (!b.name || typeof b.name !== 'string') {
    throw new Error('Невалідні дані замовлення');
  }

  if (!b.phone || typeof b.phone !== 'string') {
    throw new Error('Невалідні дані замовлення');
  }

  if (!Array.isArray(b.cartItems)) {
    throw new Error('Невалідні дані замовлення');
  }

  const itemsOk = b.cartItems.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof (item as EmailCartItem).name === 'string' &&
      typeof (item as EmailCartItem).quantity === 'number' &&
      typeof (item as EmailCartItem).price === 'number',
  );

  if (!itemsOk) {
    throw new Error('Невалідні дані замовлення');
  }
}

export async function sendOrderEmail(body: unknown): Promise<void> {
  validateRequestBody(body);

  const total = typeof body.total === 'number' ? body.total : 0;

  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) {
    throw new Error('Missing OWNER_EMAIL env var');
  }

  const tasks: Promise<unknown>[] = [
    transporter.sendMail({
      from: `"VadiAvto" <${emailUser}>`,
      to: ownerEmail,
      subject: `🛒Нове замовлення від ${sanitizeEmailHeader(body.name || 'Клієнта')}`,
      html: generateOwnerEmailHtml({ ...body, total }),
    }),
  ];

  if (body.email) {
    tasks.push(
      transporter.sendMail({
        from: `"VadiAvto" <${emailUser}>`,
        to: body.email,
        subject: '✅ Ваше замовлення прийнято',
        html: generateClientEmailHtml({ ...body, total }),
      }),
    );
  }

  await Promise.all(tasks);
}
