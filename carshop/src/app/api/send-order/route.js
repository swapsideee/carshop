import nodemailer from "nodemailer";
import { ErrorHandler } from "@/lib/utils/errorHandler";
import {
  generateOwnerEmailHtml,
  generateClientEmailHtml,
} from "@/app/api/send-order/emailTemplates";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function validateRequestBody(body) {
  if (
    typeof body !== "object" ||
    !body.name ||
    !body.phone ||
    !Array.isArray(body.cartItems) ||
    !body.cartItems.every(
      (item) =>
        typeof item.name === "string" &&
        typeof item.quantity === "number" &&
        typeof item.price === "number"
    )
  ) {
    throw new Error("Невалідні дані замовлення");
  }
}

const handler = async (req) => {
  const body = await req.json();

  validateRequestBody(body);
  const total = typeof body.total === "number" ? body.total : 0;

  const tasks = [
    transporter.sendMail({
      from: `"VadiAvto" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `🛒Нове замовлення від ${body.name || "Клієнта"}`,
      html: generateOwnerEmailHtml({ ...body, total }),
    }),
  ];

  if (body.email) {
    tasks.push(
      transporter.sendMail({
        from: `"VadiAvto" <${process.env.EMAIL_USER}>`,
        to: body.email,
        subject: "✅ Ваше замовлення прийнято",
        html: generateClientEmailHtml({ ...body, total }),
      })
    );
  }

  await Promise.all(tasks);
  console.log("Письма успешно отправлены:", tasks.length);

  return Response.json({ success: true });
};

export const POST = ErrorHandler(handler);
