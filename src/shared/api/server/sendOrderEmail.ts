import 'server-only';

import nodemailer from 'nodemailer';

import { generateClientEmailHtml, generateOwnerEmailHtml } from '@/shared/lib';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function validateRequestBody(body) {
  if (
    typeof body !== 'object' ||
    !body?.name ||
    !body?.phone ||
    !Array.isArray(body?.cartItems) ||
    !body.cartItems.every(
      (item) =>
        typeof item?.name === 'string' &&
        typeof item?.quantity === 'number' &&
        typeof item?.price === 'number',
    )
  ) {
    throw new Error('Невалідні дані замовлення');
  }
}

export async function sendOrderEmail(body) {
  validateRequestBody(body);

  const total = typeof body.total === 'number' ? body.total : 0;

  const tasks = [
    transporter.sendMail({
      from: `"VadiAvto" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `🛒Нове замовлення від ${body.name || 'Клієнта'}`,
      html: generateOwnerEmailHtml({ ...body, total }),
    }),
  ];

  if (body.email) {
    tasks.push(
      transporter.sendMail({
        from: `"VadiAvto" <${process.env.EMAIL_USER}>`,
        to: body.email,
        subject: '✅ Ваше замовлення прийнято',
        html: generateClientEmailHtml({ ...body, total }),
      }),
    );
  }

  await Promise.all(tasks);
}
